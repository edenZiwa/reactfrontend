import React, { useCallback, useEffect, useState } from "react";
import { API_ORIGIN } from "../../services/api-config.js";

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) };
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrf = await fetch(API_ORIGIN + "/auth/csrf", { credentials: "include", cache: "no-store" });
    const token = await csrf.json().catch(() => ({}));
    if (!csrf.ok || !token.csrfToken) throw new Error(token.error || "Your staff session has expired. Please sign in again.");
    headers["X-CSRF-Token"] = token.csrfToken;
  }
  let response;
  try {
    response = await fetch(API_ORIGIN + path, { ...options, method, headers, credentials: "include", cache: "no-store" });
  } catch {
    throw new Error("We could not reach the expense approval service. Check your connection and try again.");
  }
  const type = response.headers.get("content-type") || "";
  const data = type.toLowerCase().includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) throw new Error(data.error || data.message || (response.status === 401 ? "Your staff session has expired. Please sign in again." : response.status === 403 ? "You do not have permission to review these expenses." : response.status >= 500 ? "The approval service is temporarily unavailable." : "The request could not be completed."));
  return data;
}

const money = (amount, currency = "UGX") => new Intl.NumberFormat("en-UG", { style: "currency", currency, maximumFractionDigits: currency === "UGX" ? 0 : 2 }).format(Number(amount || 0));

export default function ProjectExpenseApprovals() {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ limit: 25, offset: 0, total: 0 });
  const [page, setPage] = useState(0);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const result = await request("/admin/api/projects/expenses/pending?limit=25&offset=" + (page * 25));
      setExpenses(result.expenses || []);
      setPagination(result.pagination || { limit: 25, offset: page * 25, total: 0 });
    } catch (e) { setError(e.message); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function review(item, status) {
    const action = status === "approved" ? "approve" : "reject";
    if (!window.confirm("Are you sure you want to " + action + " this expense?")) return;
    setBusyId(item.id); setError(""); setNotice("");
    try {
      await request("/admin/api/projects/" + encodeURIComponent(item.project_id) + "/expenses/" + encodeURIComponent(item.id) + "/review", {
        method: "PATCH", body: JSON.stringify({ status })
      });
      setNotice("Expense " + status + " successfully.");
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusyId(""); }
  }

  return <section className="gom-projects">
    <header className="gom-projects-heading">
      <div><span className="small text-success fw-bold text-uppercase">Finance and accountability</span><h2>Project expense approvals</h2><p>Review submitted project expenses. This workspace does not require project editing privileges.</p></div>
      <button className="btn btn-outline-success" onClick={load} disabled={Boolean(busyId)}><i className="bi bi-arrow-clockwise me-1" />Refresh</button>
    </header>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {notice && <div className="alert alert-success" role="status">{notice}</div>}
    <div className="gom-project-panel p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-3"><h3 className="h5 fw-bold mb-0">Pending review</h3><span className="badge text-bg-light border">{pagination.total} pending</span></div>
      {!expenses.length ? <p className="text-secondary mb-0">There are no project expenses awaiting approval.</p> : <div className="table-responsive"><table className="table align-middle">
        <thead><tr><th>Project</th><th>Expense</th><th>Submitted by</th><th>Date</th><th className="text-end">Amount</th><th>Decision</th></tr></thead>
        <tbody>{expenses.map(item => <tr key={item.id}>
          <td><strong>{item.project_name}</strong><small className="d-block text-secondary">{item.project_code || "Project"}</small></td>
          <td><strong>{item.category}</strong><small className="d-block text-secondary">{item.description}</small></td>
          <td>{item.submitted_by || "—"}</td><td>{item.expense_date ? new Date(item.expense_date).toLocaleDateString() : "—"}</td>
          <td className="text-end text-nowrap">{money(item.amount, item.currency)}</td>
          <td className="text-nowrap"><button className="btn btn-sm btn-success me-1" disabled={Boolean(busyId)} onClick={() => review(item, "approved")}>{busyId === item.id ? "Saving…" : "Approve"}</button><button className="btn btn-sm btn-outline-danger" disabled={Boolean(busyId)} onClick={() => review(item, "rejected")}>Reject</button></td>
        </tr>)}</tbody>
      </table></div>}
      <div className="d-flex justify-content-between align-items-center pt-2"><span className="small text-secondary">Page {page + 1} of {Math.max(1, Math.ceil(pagination.total / pagination.limit))}</span><div className="btn-group"><button className="btn btn-sm btn-outline-secondary" disabled={page === 0 || Boolean(busyId)} onClick={() => setPage(value => Math.max(0, value - 1))}>Previous</button><button className="btn btn-sm btn-outline-secondary" disabled={(page + 1) * pagination.limit >= pagination.total || Boolean(busyId)} onClick={() => setPage(value => value + 1)}>Next</button></div></div>
    </div>
  </section>;
}
