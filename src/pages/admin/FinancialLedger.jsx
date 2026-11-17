import React, { useCallback, useEffect, useState } from "react";
import { API_ORIGIN } from "../../services/api-config.js";

const apiUrl = path => API_ORIGIN + path;
const formatMoney = (value, currency) => new Intl.NumberFormat("en-UG", { style: "currency", currency, maximumFractionDigits: currency === "UGX" ? 0 : 2 }).format(Number(value || 0));
const formatDate = value => value ? new Date(value).toLocaleDateString() : "—";
const toCents = value => {
  const match = /^(\d+)(?:\\.(\d{1,2}))?$/.exec(String(value ?? "").trim());
  if (!match) return 0n;
  return BigInt(match[1]) * 100n + BigInt((match[2] || "").padEnd(2, "0"));
};
const fromCents = value => (value / 100n).toString() + "." + (value % 100n).toString().padStart(2, "0");

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) };
  if (!["GET","HEAD","OPTIONS"].includes(method)) {
    const csrfResponse = await fetch(apiUrl("/auth/csrf"), { credentials: "include", cache: "no-store" });
    const csrf = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok || !csrf.csrfToken) throw new Error(csrf.error || "Your secure staff session has expired. Please sign in again.");
    headers["X-CSRF-Token"] = csrf.csrfToken;
  }
  let response;
  try { response = await fetch(apiUrl(path), { ...options, method, headers, credentials: "include", cache: "no-store" }); }
  catch { throw new Error("We could not reach the financial reporting service. Check your connection and try again."); }
  const type = response.headers.get("content-type") || "";
  const data = type.toLowerCase().includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) throw new Error(data.error || data.message || (response.status === 401 ? "Your staff session has expired. Please sign in again." : response.status === 403 ? "You do not have permission to complete this financial action." : "The financial request could not be completed."));
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

export default function FinancialLedger({ canAdjust = false, canApprove = false, canManageSettlements = false, canApproveSettlements = false }) {
  const [currency, setCurrency] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [report, setReport] = useState({ accounts: [], totalsByCurrency: [] });
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({ limit: 25, offset: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [adjustmentBusy, setAdjustmentBusy] = useState(false);
  const [adjustmentError, setAdjustmentError] = useState("");
  const [adjustmentNotice, setAdjustmentNotice] = useState("");
  const [adjustmentForm, setAdjustmentForm] = useState({ description: "", reason: "", currency: "UGX", entryDate: new Date().toISOString().slice(0,10) });
  const [adjustmentLines, setAdjustmentLines] = useState([
    { accountCode: "1000", debit: "", credit: "", description: "" },
    { accountCode: "4000", debit: "", credit: "", description: "" },
  ]);
  const [reviewing, setReviewing] = useState(null);
  const [reviewDecision, setReviewDecision] = useState("post");
  const [reviewNote, setReviewNote] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [eligibleDonations, setEligibleDonations] = useState([]);
  const [settlementCurrency, setSettlementCurrency] = useState("UGX");
  const [settlementForm, setSettlementForm] = useState({ settlementDate: new Date().toISOString().slice(0,10), providerReference: "", bankReference: "", feeAmount: "0" });
  const [selectedAllocations, setSelectedAllocations] = useState({});
  const [settlementBusy, setSettlementBusy] = useState(false);
  const [settlementError, setSettlementError] = useState("");
  const [settlementNotice, setSettlementNotice] = useState("");
  const [settlementReviewing, setSettlementReviewing] = useState(null);
  const [settlementDecision, setSettlementDecision] = useState("post");
  const [settlementReviewNote, setSettlementReviewNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = queryString({ currency, from, to });
      const entryParams = queryString({ currency, from, to, offset: page * 25 });
      const [trial, journal, chart, adjustmentList, settlementList] = await Promise.all([
        request("/admin/api/finance-ledger/trial-balance" + (params ? "?" + params : "")),
        request("/admin/api/finance-ledger/entries?" + entryParams),
        request("/admin/api/finance-adjustments/accounts"),
        request("/admin/api/finance-adjustments/adjustments?status=pending_review&limit=50"),
        request("/admin/api/finance-settlements?limit=50"),
      ]);
      setReport(trial); setEntries(journal.entries || []);
      setPagination(journal.pagination || { limit: 25, offset: page * 25, total: 0 });
      setAccounts(chart.accounts || []);
      setAdjustments(adjustmentList.adjustments || []);
      setSettlements(settlementList.settlements || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [currency, from, to, page]);

  useEffect(() => { load(); }, [load]);

  function updateAdjustmentLine(index, field, value) {
    setAdjustmentLines(current => current.map((line,i) => i === index ? { ...line, [field]: value } : line));
  }

  async function submitAdjustment(event) {
    event.preventDefault();
    setAdjustmentBusy(true); setAdjustmentError(""); setAdjustmentNotice("");
    try {
      const result = await request("/admin/api/finance-adjustments/adjustments", {
        method: "POST",
        body: JSON.stringify({ ...adjustmentForm, lines: adjustmentLines }),
      });
      setAdjustmentNotice(result.message || "Adjustment submitted for independent review.");
      setAdjustmentForm(current => ({ ...current, description: "", reason: "" }));
      setAdjustmentLines([
        { accountCode: accounts[0]?.code || "", debit: "", credit: "", description: "" },
        { accountCode: accounts[1]?.code || "", debit: "", credit: "", description: "" },
      ]);
      await load();
    } catch (e) { setAdjustmentError(e.message); }
    finally { setAdjustmentBusy(false); }
  }

  async function reviewAdjustment() {
    if (!reviewing) return;
    if (reviewDecision === "reject" && reviewNote.trim().length < 10) {
      setAdjustmentError("Provide a rejection explanation of at least 10 characters.");
      return;
    }
    setAdjustmentBusy(true); setAdjustmentError(""); setAdjustmentNotice("");
    try {
      const result = await request("/admin/api/finance-adjustments/adjustments/" + encodeURIComponent(reviewing) + "/review", {
        method: "POST",
        body: JSON.stringify({ decision: reviewDecision, note: reviewNote }),
      });
      setAdjustmentNotice(result.message || "Adjustment review completed.");
      setReviewing(null); setReviewNote("");
      await load();
    } catch (e) { setAdjustmentError(e.message); }
    finally { setAdjustmentBusy(false); }
  }

  const loadEligibleDonations = useCallback(async () => {
    if (!canManageSettlements) return;
    try {
      const result = await request("/admin/api/finance-settlements/eligible-donations?currency=" + settlementCurrency);
      setEligibleDonations(result.donations || []);
      setSelectedAllocations({});
    } catch (e) { setSettlementError(e.message); }
  }, [canManageSettlements, settlementCurrency]);

  useEffect(() => { loadEligibleDonations(); }, [loadEligibleDonations]);

  const selectedDonationLines = eligibleDonations.filter(item => selectedAllocations[item.id]);
  const settlementGrossCents = selectedDonationLines.reduce((sum,item) => sum + toCents(selectedAllocations[item.id]), 0n);
  const settlementFeeCents = toCents(settlementForm.feeAmount);
  const settlementNetCents = settlementGrossCents - settlementFeeCents;
  const settlementGross = fromCents(settlementGrossCents);
  const settlementFee = fromCents(settlementFeeCents);
  const settlementNet = settlementNetCents >= 0n ? fromCents(settlementNetCents) : "0.00";

  async function submitSettlement(event) {
    event.preventDefault();
    setSettlementBusy(true); setSettlementError(""); setSettlementNotice("");
    try {
      const allocations = selectedDonationLines.map(item => ({ donationId: item.id, amount: selectedAllocations[item.id] }));
      const result = await request("/admin/api/finance-settlements", {
        method: "POST",
        body: JSON.stringify({
          ...settlementForm,
          currency: settlementCurrency,
          grossAmount: settlementGross,
          feeAmount: settlementFee,
          netAmount: settlementNet,
          allocations,
        }),
      });
      setSettlementNotice(result.message || "Settlement submitted for independent review.");
      setSettlementForm(current => ({ ...current, providerReference: "", bankReference: "", feeAmount: "0" }));
      setSelectedAllocations({});
      await Promise.all([load(), loadEligibleDonations()]);
    } catch (e) { setSettlementError(e.message); }
    finally { setSettlementBusy(false); }
  }

  async function reviewSettlement() {
    if (!settlementReviewing) return;
    if (settlementDecision === "reject" && settlementReviewNote.trim().length < 10) {
      setSettlementError("Provide a rejection explanation of at least 10 characters.");
      return;
    }
    setSettlementBusy(true); setSettlementError(""); setSettlementNotice("");
    try {
      const result = await request("/admin/api/finance-settlements/" + encodeURIComponent(settlementReviewing) + "/review", {
        method: "POST",
        body: JSON.stringify({ decision: settlementDecision, note: settlementReviewNote }),
      });
      setSettlementNotice(result.message || "Settlement review completed.");
      setSettlementReviewing(null); setSettlementReviewNote("");
      await Promise.all([load(), loadEligibleDonations()]);
    } catch (e) { setSettlementError(e.message); }
    finally { setSettlementBusy(false); }
  }

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
    {(canManageSettlements || canApproveSettlements) && <div className="gom-project-panel p-3 p-md-4 mt-4">
      <div className="mb-3"><span className="small text-success fw-bold text-uppercase">Bank reconciliation</span><h3 className="h5 fw-bold mt-1 mb-1">Pesapal settlements</h3><p className="small text-secondary mb-0">Match completed donations to the provider's settlement statement. A second authorised staff member must approve each batch.</p></div>
      {settlementError && <div className="alert alert-danger" role="alert">{settlementError}</div>}
      {settlementNotice && <div className="alert alert-success" role="status">{settlementNotice}</div>}

      {canManageSettlements && <form onSubmit={submitSettlement} className="border rounded-3 p-3 mb-4">
        <h4 className="h6 fw-bold mb-3">Prepare a settlement batch</h4>
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="settlement-currency">Currency</label><select id="settlement-currency" className="form-select" value={settlementCurrency} onChange={e => {setSettlementCurrency(e.target.value);setSelectedAllocations({});}}><option value="UGX">UGX</option><option value="USD">USD</option></select></div>
          <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="settlement-date">Settlement date</label><input id="settlement-date" type="date" className="form-control" required value={settlementForm.settlementDate} onChange={e => setSettlementForm(current => ({...current,settlementDate:e.target.value}))} /></div>
          <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="settlement-provider-ref">Pesapal settlement reference</label><input id="settlement-provider-ref" className="form-control" required minLength="4" maxLength="120" value={settlementForm.providerReference} onChange={e => setSettlementForm(current => ({...current,providerReference:e.target.value}))} /></div>
          <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="settlement-bank-ref">Bank statement reference</label><input id="settlement-bank-ref" className="form-control" required minLength="3" maxLength="120" value={settlementForm.bankReference} onChange={e => setSettlementForm(current => ({...current,bankReference:e.target.value}))} /></div>
        </div>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2"><h5 className="h6 fw-bold mb-0">Unsettled confirmed donations</h5><button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadEligibleDonations} disabled={settlementBusy}><i className="bi bi-arrow-clockwise me-1" />Refresh donations</button></div>
        {!eligibleDonations.length ? <p className="small text-secondary">No unsettled {settlementCurrency} donations are currently available for allocation.</p> : <div className="table-responsive"><table className="table table-sm align-middle">
          <thead><tr><th>Include</th><th>Donation reference</th><th>Date paid</th><th className="text-end">Available</th><th className="text-end">Allocate</th></tr></thead>
          <tbody>{eligibleDonations.map(item => <tr key={item.id}>
            <td><input className="form-check-input" type="checkbox" aria-label={"Include donation "+item.merchant_reference} checked={Boolean(selectedAllocations[item.id])} onChange={e => setSelectedAllocations(current => {const next={...current};if(e.target.checked)next[item.id]=String(item.available_amount);else delete next[item.id];return next;})} /></td>
            <td className="text-nowrap">{item.merchant_reference}</td><td className="text-nowrap">{formatDate(item.paid_at)}</td><td className="text-end text-nowrap">{formatMoney(item.available_amount,settlementCurrency)}</td>
            <td className="text-end"><input type="number" min="0.01" max={item.available_amount} step="0.01" className="form-control form-control-sm text-end w-auto ms-auto" aria-label={"Allocation for "+item.merchant_reference} disabled={!selectedAllocations[item.id]} value={selectedAllocations[item.id] || ""} onChange={e => setSelectedAllocations(current => ({...current,[item.id]:e.target.value}))} /></td>
          </tr>)}</tbody>
        </table></div>}
        <div className="row g-3 align-items-end mt-1">
          <div className="col-sm-6 col-lg-3"><label className="form-label" htmlFor="settlement-fee">Processing fee ({settlementCurrency})</label><input id="settlement-fee" type="number" min="0" step="0.01" className="form-control" value={settlementForm.feeAmount} onChange={e => setSettlementForm(current => ({...current,feeAmount:e.target.value}))} /></div>
          <div className="col-sm-6 col-lg-3"><span className="small text-secondary d-block">Gross allocated</span><strong>{formatMoney(settlementGross,settlementCurrency)}</strong></div>
          <div className="col-sm-6 col-lg-3"><span className="small text-secondary d-block">Net to bank</span><strong>{formatMoney(settlementNet,settlementCurrency)}</strong></div>
          <div className="col-sm-6 col-lg-3"><button type="submit" className="btn btn-success w-100" disabled={settlementBusy || !selectedDonationLines.length || settlementNetCents < 0n || settlementGrossCents <= 0n}>{settlementBusy ? "Submitting…" : "Submit settlement for review"}</button></div>
        </div>
        <p className="small text-secondary mt-2 mb-0">Gross allocations must match the provider statement. Net bank receipt plus fees must equal gross. Donations already allocated to another pending or posted batch are excluded.</p>
      </form>}

      {canApproveSettlements && <div>
        <div className="d-flex justify-content-between align-items-center mb-2"><h4 className="h6 fw-bold mb-0">Pending settlement approvals</h4><span className="badge text-bg-light border">{settlements.filter(item => item.status === "pending_review").length} pending</span></div>
        {settlements.filter(item => item.status === "pending_review").length === 0 ? <p className="small text-secondary">No provider settlements are awaiting review.</p> : settlements.filter(item => item.status === "pending_review").map(item => <article className="border rounded-3 p-3 mb-2" key={item.id}>
          <div className="d-flex flex-wrap justify-content-between gap-2"><div><strong>{item.provider_reference}</strong><p className="small text-secondary mb-1">Bank reference: {item.bank_reference}</p><span className="small text-secondary">{item.currency} · {formatDate(item.settlement_date)} · Submitted by {item.created_by_name || "Staff member"}</span></div><span className="badge text-bg-warning align-self-start">Pending review</span></div>
          <div className="row g-2 small mt-2"><div className="col-4">Gross: <strong>{formatMoney(item.gross_amount,item.currency)}</strong></div><div className="col-4">Fees: <strong>{formatMoney(item.fee_amount,item.currency)}</strong></div><div className="col-4">Net: <strong>{formatMoney(item.net_amount,item.currency)}</strong></div></div>
          <div className="small text-secondary mt-2">{item.allocations.length} donation allocations · {item.allocations.map(allocation => allocation.reference).join(", ")}</div>
          {settlementReviewing === item.id ? <div className="mt-3"><label className="form-label small" htmlFor={"settlement-review-note-"+item.id}>{settlementDecision === "reject" ? "Rejection explanation (required)" : "Review note (optional)"}</label><textarea id={"settlement-review-note-"+item.id} className="form-control mb-2" rows="2" value={settlementReviewNote} onChange={e => setSettlementReviewNote(e.target.value)} placeholder="Record the settlement review decision." /><div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-sm btn-success" onClick={reviewSettlement} disabled={settlementBusy || (settlementDecision === "reject" && settlementReviewNote.trim().length < 10)}>{settlementDecision === "post" ? "Confirm and post settlement" : "Confirm rejection"}</button><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {setSettlementReviewing(null);setSettlementReviewNote("");}} disabled={settlementBusy}>Cancel</button></div></div> : <div className="d-flex flex-wrap gap-2 mt-2"><button type="button" className="btn btn-sm btn-success" onClick={() => {setSettlementReviewing(item.id);setSettlementDecision("post");setSettlementReviewNote("");}} disabled={settlementBusy}>Review and post</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {setSettlementReviewing(item.id);setSettlementDecision("reject");setSettlementReviewNote("");}} disabled={settlementBusy}>Reject batch</button></div>}
        </article>)}
      </div>}
    </div>}

    {(canAdjust || canApprove) && <div className="gom-project-panel p-3 p-md-4 mt-4">
      <div className="mb-3"><span className="small text-success fw-bold text-uppercase">Financial controls</span><h3 className="h5 fw-bold mt-1 mb-1">Manual journal adjustments</h3><p className="small text-secondary mb-0">Adjustments are submitted first, then reviewed by a different authorised staff member before posting.</p></div>
      {adjustmentError && <div className="alert alert-danger" role="alert">{adjustmentError}</div>}
      {adjustmentNotice && <div className="alert alert-success" role="status">{adjustmentNotice}</div>}

      {canAdjust && <form onSubmit={submitAdjustment} className="border rounded-3 p-3 mb-4">
        <h4 className="h6 fw-bold mb-3">Submit an adjustment for review</h4>
        <div className="row g-3 mb-3">
          <div className="col-md-6"><label className="form-label" htmlFor="adjustment-description">Journal description</label><input id="adjustment-description" className="form-control" maxLength="500" required minLength="5" value={adjustmentForm.description} onChange={e => setAdjustmentForm(current => ({...current,description:e.target.value}))} /></div>
          <div className="col-sm-6 col-md-3"><label className="form-label" htmlFor="adjustment-currency">Currency</label><select id="adjustment-currency" className="form-select" value={adjustmentForm.currency} onChange={e => setAdjustmentForm(current => ({...current,currency:e.target.value}))}><option value="UGX">UGX</option><option value="USD">USD</option></select></div>
          <div className="col-sm-6 col-md-3"><label className="form-label" htmlFor="adjustment-date">Entry date</label><input id="adjustment-date" type="date" className="form-control" required value={adjustmentForm.entryDate} onChange={e => setAdjustmentForm(current => ({...current,entryDate:e.target.value}))} /></div>
          <div className="col-12"><label className="form-label" htmlFor="adjustment-reason">Reason and supporting explanation</label><textarea id="adjustment-reason" className="form-control" rows="2" minLength="10" required value={adjustmentForm.reason} onChange={e => setAdjustmentForm(current => ({...current,reason:e.target.value}))} placeholder="Explain why this accounting adjustment is needed." /></div>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-2 mb-2"><h5 className="h6 fw-bold mb-0">Journal lines</h5><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setAdjustmentLines(current => current.length < 20 ? [...current,{accountCode:accounts[0]?.code || "",debit:"",credit:"",description:""}] : current)} disabled={adjustmentLines.length >= 20}>Add line</button></div>
        {adjustmentLines.map((line,index) => <div className="row g-2 align-items-end border-top py-2" key={index}>
          <div className="col-12 col-md-4"><label className="form-label small" htmlFor={"adjust-account-"+index}>Account</label><select id={"adjust-account-"+index} className="form-select form-select-sm" required value={line.accountCode} onChange={e => updateAdjustmentLine(index,"accountCode",e.target.value)}><option value="">Select account</option>{accounts.map(account => <option key={account.code} value={account.code}>{account.code} · {account.name}</option>)}</select></div>
          <div className="col-6 col-md-2"><label className="form-label small" htmlFor={"adjust-debit-"+index}>Debit</label><input id={"adjust-debit-"+index} type="number" min="0" step="0.01" className="form-control form-control-sm" value={line.debit} onChange={e => updateAdjustmentLine(index,"debit",e.target.value)} /></div>
          <div className="col-6 col-md-2"><label className="form-label small" htmlFor={"adjust-credit-"+index}>Credit</label><input id={"adjust-credit-"+index} type="number" min="0" step="0.01" className="form-control form-control-sm" value={line.credit} onChange={e => updateAdjustmentLine(index,"credit",e.target.value)} /></div>
          <div className="col-10 col-md-3"><label className="form-label small" htmlFor={"adjust-line-note-"+index}>Line description</label><input id={"adjust-line-note-"+index} className="form-control form-control-sm" maxLength="300" value={line.description} onChange={e => updateAdjustmentLine(index,"description",e.target.value)} /></div>
          <div className="col-2 col-md-1 text-end"><button type="button" className="btn btn-sm btn-outline-danger" aria-label={"Remove line "+(index+1)} disabled={adjustmentLines.length <= 2} onClick={() => setAdjustmentLines(current => current.filter((_,i) => i !== index))}><i className="bi bi-trash" /></button></div>
        </div>)}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3"><p className="small text-secondary mb-0">Debits must equal credits. A different reviewer must approve this request.</p><button type="submit" className="btn btn-success" disabled={adjustmentBusy || accounts.length === 0}>{adjustmentBusy ? "Submitting…" : "Submit for review"}</button></div>
      </form>}

      {canApprove && <div>
        <div className="d-flex justify-content-between align-items-center mb-2"><h4 className="h6 fw-bold mb-0">Pending independent review</h4><span className="badge text-bg-light border">{adjustments.length} pending</span></div>
        {!adjustments.length ? <p className="small text-secondary">No manual journal adjustments are awaiting review.</p> : adjustments.map(item => <article className="border rounded-3 p-3 mb-2" key={item.id}>
          <div className="d-flex flex-wrap justify-content-between gap-2"><div><strong>{item.description}</strong><p className="small text-secondary mb-1">{item.reason}</p><span className="small text-secondary">{item.currency} · {formatDate(item.entry_date)} · Submitted by {item.created_by_name || "Staff member"}</span></div><span className="badge text-bg-warning align-self-start">Pending review</span></div>
          <div className="table-responsive mt-2"><table className="table table-sm mb-2"><thead><tr><th>Account</th><th className="text-end">Debit</th><th className="text-end">Credit</th></tr></thead><tbody>{item.lines.map((line,index) => <tr key={index}><td>{line.accountCode} · {line.accountName}</td><td className="text-end">{line.debit > 0 ? formatMoney(line.debit,item.currency) : "—"}</td><td className="text-end">{line.credit > 0 ? formatMoney(line.credit,item.currency) : "—"}</td></tr>)}</tbody></table></div>
          {reviewing === item.id ? <div className="mt-3"><label className="form-label small" htmlFor={"review-note-"+item.id}>{reviewDecision === "reject" ? "Rejection explanation (required)" : "Review note (optional)"}</label><textarea id={"review-note-"+item.id} className="form-control mb-2" rows="2" value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="Record the review decision or reason." /><div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-sm btn-success" onClick={reviewAdjustment} disabled={adjustmentBusy || (reviewDecision === "reject" && reviewNote.trim().length < 10)}>{reviewDecision === "post" ? "Confirm and post" : "Confirm rejection"}</button><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {setReviewing(null);setReviewNote("");}} disabled={adjustmentBusy}>Cancel</button></div></div> : <div className="d-flex flex-wrap gap-2 mt-2"><button type="button" className="btn btn-sm btn-success" onClick={() => {setReviewing(item.id);setReviewDecision("post");setReviewNote("");}} disabled={adjustmentBusy}>Review and post</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {setReviewing(item.id);setReviewDecision("reject");setReviewNote("");}} disabled={adjustmentBusy}>Reject request</button></div>}
        </article>)}
      </div>}
    </div>}

    <p className="small text-secondary mt-3 mb-0"><i className="bi bi-shield-lock me-1" />Financial entries are immutable after posting. No currency conversion is applied. This initial ledger records confirmed donations and approved project expenses on an accrual basis.</p>
  </section>;
}
