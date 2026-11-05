import React, { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const money = (amount, currency) => new Intl.NumberFormat("en-UG", { style: "currency", currency: currency || "UGX", maximumFractionDigits: currency === "UGX" ? 0 : 2 }).format(Number(amount || 0));

export default function SponsorPortal() {
  const [data, setData] = useState({ sponsorships: [], approvedReports: [], payments: [], schedules: [] });
  const [children, setChildren] = useState([]);
  const [form, setForm] = useState({ childProfileId: "", sponsorshipModel: "individual", contributionFrequency: "monthly", proposedAmount: "", currency: "UGX", message: "" });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingError, setLoadingError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      let results;
      try {
        results = await Promise.all([
          fetch(API_BASE + "/account/sponsorships", { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } }),
          fetch(API_BASE + "/sponsorship/children", { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } })
        ]);
      } catch { throw new Error("We could not connect to sponsorship services. Check your internet connection and try again."); }
      const own = await results[0].json().catch(() => ({}));
      const directory = await results[1].json().catch(() => ({}));
      if (!results[0].ok || !results[1].ok) {
        const failed = !results[0].ok ? results[0] : results[1];
        throw new Error(failed.status === 401 ? "Your session has expired. Please sign in again." : failed.status === 403 ? "You do not have permission to view this sponsorship information." : failed.status >= 500 ? "The sponsorship service is temporarily unavailable. Please try again shortly." : own.error || directory.error || "We could not load sponsorship information. Please refresh and try again.");
      }
      setData(own); setChildren(directory.children || []);
    } catch (e) { setError(e.message); setLoadingError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      let tokenResponse;
      try { tokenResponse = await fetch(API_BASE + "/auth/csrf", { credentials: "include", cache: "no-store" }); }
      catch { throw new Error("We could not reach the secure session service. Check your connection and sign in again."); }
      const token = await tokenResponse.json().catch(() => ({}));
      if (!tokenResponse.ok || !token.csrfToken) throw new Error(token.error || "Your session has expired. Please sign in again.");
      const response = await fetch(API_BASE + "/account/sponsorship-interests", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": token.csrfToken },
        body: JSON.stringify({ ...form, proposedAmount: form.proposedAmount || null, childProfileId: form.childProfileId || null })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const messages = { 400: "Please review the sponsorship details and try again.", 401: "Your session has expired. Please sign in again.", 403: "You are not authorised to submit this request.", 409: "A similar sponsorship request already exists. Please refresh your account.", 422: "Some sponsorship details are invalid. Please review the form.", 429: "Too many requests. Please wait and try again." };
        throw new Error(result.message || result.error || messages[response.status] || (response.status >= 500 ? "The sponsorship service is temporarily unavailable. Please try again shortly." : "Unable to submit sponsorship interest. Please try again."));
      }
      setNotice(result.message || "Your sponsorship interest has been submitted.");
      setForm({ childProfileId: "", sponsorshipModel: "individual", contributionFrequency: "monthly", proposedAmount: "", currency: "UGX", message: "" });
    } catch (e) { setError(e.message || "We could not submit your sponsorship interest. Please try again."); }
    finally { setBusy(false); }
  }

  if (loading) return <section className="panel p-4 text-center" role="status"><span className="spinner-border spinner-border-sm text-success me-2" />Loading sponsorship information…</section>;
  return <section className="panel p-4 p-md-5 mb-4">
    <div className="d-flex justify-content-between flex-wrap gap-2 mb-3"><div><h2 className="panel-title mb-1">Child sponsorship</h2><p className="small-muted">Your sponsorships, approved quarterly updates and contributions.</p></div><button className="btn btn-sm btn-outline-success" onClick={load} disabled={loading}>Refresh</button></div>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}{notice && <div className="alert alert-success" role="status">{notice}</div>}
    <h3 className="h5 fw-bold">Your sponsorships</h3>
    {!data.sponsorships?.length ? <p className="text-secondary">No sponsorship assignments are linked to your account yet.</p> : <div className="row g-3 mb-4">{data.sponsorships.map(item => <div className="col-12 col-lg-6" key={item.id}><article className="feature h-100"><div className="d-flex justify-content-between"><strong>{item.display_name}</strong><span className="badge text-bg-light border">{item.status}</span></div><p className="small-muted">{item.age_band} · {item.region_label}</p><strong>{money(item.expected_amount,item.currency)}</strong><div className="small text-secondary">{item.sponsorship_model} · {item.contribution_frequency}</div></article></div>)}</div>}
    <h3 className="h5 fw-bold mt-4">Approved quarterly progress reports</h3>
    {!data.approvedReports?.length ? <p className="text-secondary">Approved reports will appear here after foundation review.</p> : <div className="d-grid gap-3 mb-4">{data.approvedReports.map(r => <article className="border rounded-3 p-3" key={r.id}><strong>{r.school_name || "Child progress update"}</strong><small className="d-block text-secondary">{r.period_start} – {r.period_end}</small><p className="mt-2">{r.academic_summary}</p>{r.attendance_summary && <p className="small"><strong>Attendance:</strong> {r.attendance_summary}</p>}{r.strengths && <p className="small"><strong>Strengths:</strong> {r.strengths}</p>}{r.support_needs && <p className="small"><strong>Support needs:</strong> {r.support_needs}</p>}{r.welfare_update && <p className="small"><strong>Wellbeing:</strong> {r.welfare_update}</p>}{r.next_steps && <p className="small mb-0"><strong>Next steps:</strong> {r.next_steps}</p>}</article>)}</div>}
    <h3 className="h5 fw-bold mt-4">Confirmed contribution history</h3>
    {!data.payments?.length ? <p className="text-secondary">Confirmed sponsorship contributions will appear here.</p> : <div className="table-responsive mb-3"><table className="table table-sm"><thead><tr><th>Date</th><th>Reference</th><th>Amount</th></tr></thead><tbody>{data.payments.map((p,i)=><tr key={p.sponsorship_match_id + "-" + i}><td>{new Date(p.received_at).toLocaleDateString()}</td><td>{p.merchant_reference || p.provider_reference || "—"}</td><td>{money(p.amount,p.currency)}</td></tr>)}</tbody></table></div>}
    {data.schedules?.length > 0 && <p className="small text-secondary">Expected contributions: {data.schedules.filter(x=>x.status==="paid").length} paid; {data.schedules.filter(x=>["expected","overdue"].includes(x.status)).length} outstanding. Schedules track expected payments and do not automatically debit your account.</p>}
    <hr className="my-4" /><h3 className="h5 fw-bold">Express sponsorship interest</h3><p className="small-muted">Choose individual or shared sponsorship and monthly or flexible giving. The foundation reviews requests before confirming an assignment.</p>
    <form className="row g-3" onSubmit={submit}>
      <div className="col-12"><label className="form-label">Child preference (optional)</label><select className="form-select" value={form.childProfileId} onChange={e=>setForm({...form,childProfileId:e.target.value})}><option value="">Open to a recommendation</option>{children.map(c=><option key={c.id} value={c.id}>{c.display_name} · {c.region_label} · {c.age_band}</option>)}</select></div>
      <div className="col-6 col-md-3"><label className="form-label">Model</label><select className="form-select" value={form.sponsorshipModel} onChange={e=>setForm({...form,sponsorshipModel:e.target.value})}><option value="individual">Individual</option><option value="shared">Shared</option></select></div>
      <div className="col-6 col-md-3"><label className="form-label">Frequency</label><select className="form-select" value={form.contributionFrequency} onChange={e=>setForm({...form,contributionFrequency:e.target.value})}><option value="monthly">Monthly</option><option value="flexible">Flexible</option></select></div>
      <div className="col-6 col-md-3"><label className="form-label">Proposed amount</label><input type="number" min="1" step="0.01" className="form-control" value={form.proposedAmount} onChange={e=>setForm({...form,proposedAmount:e.target.value})}/></div>
      <div className="col-6 col-md-3"><label className="form-label">Currency</label><select className="form-select" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}><option>UGX</option><option>USD</option></select></div>
      <div className="col-12"><label className="form-label">Message (optional)</label><textarea className="form-control" rows="3" maxLength="1500" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></div>
      <div className="col-12"><button className="btn btn-mercy" disabled={busy}>{busy ? "Submitting…" : "Submit sponsorship interest"}</button></div>
    </form>
  </section>;
}
