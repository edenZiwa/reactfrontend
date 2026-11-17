import React, { useCallback, useEffect, useState } from "react";
import { API_ORIGIN } from "../../services/api-config.js";

const apiUrl = path => API_ORIGIN + path;
const formatMoney = (value, currency) => new Intl.NumberFormat("en-UG", { style: "currency", currency, maximumFractionDigits: currency === "UGX" ? 0 : 2 }).format(Number(value || 0));
const formatDate = value => value ? new Date(value).toLocaleDateString() : "—";

async function request(path) {
  let response;
  try { response = await fetch(apiUrl(path), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } }); }
  catch { throw new Error("We could not reach the financial reporting service. Check your connection and try again."); }
  const type = response.headers.get("content-type") || "";
  const data = type.toLowerCase().includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) throw new Error(data.error || data.message || (response.status === 401 ? "Your staff session has expired. Please sign in again." : response.status === 403 ? "You do not have permission to view the financial ledger." : "The financial report could not be loaded."));
  return data;
}

function queryString({ currency, from, to, offset }) {
  const query = new URLSearchParams();
  if (currency !== "all") query.set("currency", currency);
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  if (offset != null) { query.set("limit", "25"); query.set("offset", String(offset)); }
  return query.toString();
}

export default function FinancialLedger() {
  const [currency, setCurrency] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [report, setReport] = useState({ accounts: [], totalsByCurrency: [] });
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({ limit: 25, offset: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = queryString({ currency, from, to });
      const entryParams = queryString({ currency, from, to, offset: page * 25 });
      const [trial, journal] = await Promise.all([
        request("/admin/api/finance-ledger/trial-balance" + (params ? "?" + params : "")),
        request("/admin/api/finance-ledger/entries?" + entryParams),
      ]);
      setReport(trial); setEntries(journal.entries || []);
      setPagination(journal.pagination || { limit: 25, offset: page * 25, total: 0 });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [currency, from, to, page]);

  useEffect(() => { load(); }, [load]);
  const hasRangeError = Boolean(from && to && from > to);
  const currencyGroups = currency === "all" ? ["UGX", "USD"] : [currency];

  return <section className="gom-financial-ledger">
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div><span className="small text-success fw-bold text-uppercase">Finance and accountability</span><h2 className="h3 fw-bold mt-1 mb-2">Financial ledger</h2><p className="text-secondary mb-0">Review posted double-entry journals and trial balances. UGX and USD are always reported separately.</p></div>
      <button type="button" className="btn btn-outline-success" onClick={load} disabled={loading || hasRangeError}><i className="bi bi-arrow-clockwise me-2" />Refresh</button>
    </div>

    <div className="gom-project-panel p-3 p-md-4 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="ledger-currency">Reporting currency</label><select id="ledger-currency" className="form-select" value={currency} onChange={e => { setCurrency(e.target.value); setPage(0); }}><option value="all">All currencies (separate)</option><option value="UGX">UGX</option><option value="USD">USD</option></select></div>
        <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="ledger-from">From date</label><input id="ledger-from" type="date" className="form-control" value={from} onChange={e => { setFrom(e.target.value); setPage(0); }} /></div>
        <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="ledger-to">To date</label><input id="ledger-to" type="date" className="form-control" value={to} onChange={e => { setTo(e.target.value); setPage(0); }} /></div>
        <div className="col-sm-6 col-lg-3"><button type="button" className="btn btn-success w-100" onClick={() => { setPage(0); load(); }} disabled={loading || hasRangeError}>Apply filters</button></div>
      </div>
      {hasRangeError && <div className="small text-danger mt-2" role="alert">The start date must be on or before the end date.</div>}
    </div>

    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {loading && <div className="d-flex align-items-center gap-2 text-secondary py-3" role="status"><span className="spinner-border spinner-border-sm" />Loading financial records…</div>}
    {!loading && !error && <>
      <div className="row g-3 mb-4">
        {report.totalsByCurrency.map(total => <div className="col-md-6" key={total.currency}><article className="gom-project-panel p-3 p-md-4 h-100">
          <div className="d-flex justify-content-between align-items-center mb-3"><span className="small text-uppercase text-secondary fw-bold">Trial balance</span><span className="badge text-bg-light border">{total.currency}</span></div>
          <div className="row g-3"><div className="col-6"><span className="small text-secondary d-block">Total debits</span><strong className="fs-5">{formatMoney(total.total_debits,total.currency)}</strong></div><div className="col-6"><span className="small text-secondary d-block">Total credits</span><strong className="fs-5">{formatMoney(total.total_credits,total.currency)}</strong></div></div>
          <div className="small text-success mt-3"><i className="bi bi-check-circle me-1" />Debits and credits balance</div>
        </article></div>)}
        {!report.totalsByCurrency.length && <div className="col-12"><div className="gom-project-panel p-3 text-secondary">No posted journal entries exist for this reporting period.</div></div>}
      </div>

      <div className="gom-project-panel p-3 p-md-4 mb-4">
        <div className="mb-3"><h3 className="h5 fw-bold mb-1">Account balances</h3><p className="small text-secondary mb-0">Debit and credit totals by account and currency.</p></div>
        {currencyGroups.map(code => {
          const rows = report.accounts.filter(item => item.currency === code);
          if (!rows.length) return null;
          return <div className="mb-4" key={code}><h4 className="h6 fw-bold">{code}</h4><div className="table-responsive"><table className="table table-sm align-middle mb-0">
            <thead><tr><th>Account</th><th>Type</th><th className="text-end">Debits</th><th className="text-end">Credits</th><th className="text-end">Net (Dr − Cr)</th></tr></thead>
            <tbody>{rows.map(item => <tr key={item.code}><td><strong>{item.code}</strong> · {item.name}</td><td>{item.account_type}</td><td className="text-end text-nowrap">{formatMoney(item.debits,code)}</td><td className="text-end text-nowrap">{formatMoney(item.credits,code)}</td><td className="text-end text-nowrap">{formatMoney(item.net_balance,code)}</td></tr>)}</tbody>
          </table></div></div>;
        })}
        {!report.accounts.length && <p className="text-secondary mb-0">Account balances will appear when financial activity is posted.</p>}
      </div>

      <div className="gom-project-panel p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div><h3 className="h5 fw-bold mb-1">Journal history</h3><p className="small text-secondary mb-0">Posted financial entries are read-only. Corrections use reversal records.</p></div><span className="badge text-bg-light border">{pagination.total} entries</span></div>
        {!entries.length ? <p className="text-secondary mb-0">No journal entries match these filters.</p> : <div className="table-responsive"><table className="table align-middle">
          <thead><tr><th>Entry</th><th>Date</th><th>Description</th><th>Source</th><th>Currency</th><th className="text-end">Debits</th><th className="text-end">Credits</th></tr></thead>
          <tbody>{entries.map(entry => {
            const debits = entry.lines.reduce((sum,line) => sum + Number(line.debit || 0),0);
            const credits = entry.lines.reduce((sum,line) => sum + Number(line.credit || 0),0);
            return <tr key={entry.id}><td className="text-nowrap">#{entry.entry_number}</td><td className="text-nowrap">{formatDate(entry.entry_date)}</td>
              <td><strong>{entry.description}</strong><details className="small mt-1"><summary className="text-success">View journal lines</summary><ul className="list-unstyled mt-2 mb-0">{entry.lines.map((line,index) => <li key={index} className="mb-1">{line.accountCode} · {line.accountName}: {Number(line.debit) > 0 ? "Dr " + formatMoney(line.debit,entry.currency) : "Cr " + formatMoney(line.credit,entry.currency)}</li>)}</ul></details></td>
              <td><span className="badge text-bg-light border">{entry.source_type.replaceAll("_"," ")}</span></td><td>{entry.currency}</td><td className="text-end text-nowrap">{formatMoney(debits,entry.currency)}</td><td className="text-end text-nowrap">{formatMoney(credits,entry.currency)}</td>
            </tr>;
          })}</tbody>
        </table></div>}
        <div className="d-flex justify-content-between align-items-center pt-3"><span className="small text-secondary">Page {page + 1} of {Math.max(1,Math.ceil(pagination.total / pagination.limit))}</span><div className="btn-group">
          <button type="button" className="btn btn-sm btn-outline-secondary" disabled={page === 0 || loading} onClick={() => setPage(value => Math.max(0,value - 1))}>Previous</button>
          <button type="button" className="btn btn-sm btn-outline-secondary" disabled={(page + 1) * pagination.limit >= pagination.total || loading} onClick={() => setPage(value => value + 1)}>Next</button>
        </div></div>
      </div>
    </>}
    <p className="small text-secondary mt-3 mb-0"><i className="bi bi-shield-lock me-1" />Financial entries are immutable after posting. No currency conversion is applied. This initial ledger records confirmed donations and approved project expenses on an accrual basis.</p>
  </section>;
}
