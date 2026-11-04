import React, { useCallback, useEffect, useState } from "react";
import "../../css/donors.css";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API = path => API_ORIGIN + path;

async function csrfToken() {
  const response = await fetch(API("/auth/csrf"), { credentials: "include", cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.csrfToken) throw new Error(data.error || "Could not start a secure session.");
  return data.csrfToken;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) };
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers["X-CSRF-Token"] = await csrfToken();
  const response = await fetch(API(path), { ...options, method, headers, credentials: "include", cache: "no-store" });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) throw new Error(data.error || data.message || "The request could not be completed.");
  return data;
}

const money = (value, currency) => new Intl.NumberFormat("en-UG", {
  style: "currency", currency: currency || "UGX", maximumFractionDigits: currency === "UGX" ? 0 : 2
}).format(Number(value || 0));
const date = value => value ? new Date(value).toLocaleDateString() : "—";
const label = value => String(value || "—").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
const emptyForm = () => ({
  name: "", email: "", phone: "", donor_type: "individual", organization_name: "",
  postal_address: "", preferred_contact_method: "email", email_opt_in: false,
  sms_opt_in: false, notes: ""
});

function Metric({ title, value, icon, detail }) {
  return <article className="gom-donor-metric">
    <div><span>{title}</span><i className={"bi " + icon} /></div>
    <strong>{value ?? "—"}</strong>
    <small>{detail}</small>
  </article>;
}

function GivingTotals({ donor }) {
  return <div className="d-flex flex-wrap gap-3">
    <div className="gom-giving-total"><small>Lifetime giving · UGX</small><strong>{money(donor.lifetime_ugx, "UGX")}</strong></div>
    <div className="gom-giving-total"><small>Lifetime giving · USD</small><strong>{money(donor.lifetime_usd, "USD")}</strong></div>
  </div>;
}

export default function Donors({ canManage = false }) {
  const [donors, setDonors] = useState([]);
  const [retention, setRetention] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [selectedId, setSelectedId] = useState("");
  const [profile, setProfile] = useState(null);
  const [communication, setCommunication] = useState({ channel: "email", direction: "outbound", subject: "", summary: "", outcome: "", follow_up_at: "" });
  const [statementDates, setStatementDates] = useState({ from: "", to: "" });
  const [statement, setStatement] = useState(null);
  const [statementBusy, setStatementBusy] = useState(false);

  const loadDonors = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (status !== "all") query.set("status", status);
      if (type !== "all") query.set("type", type);
      query.set("limit", "100");
      const result = await request("/admin/api/donors?" + query.toString());
      setDonors(result.donors || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [search, status, type]);

  const loadRetention = useCallback(async () => {
    try { const result = await request("/admin/api/donors/retention"); setRetention(result.summary || null); }
    catch (e) { setError(e.message); }
  }, []);

  const loadProfile = useCallback(async id => {
    if (!id) { setProfile(null); return; }
    try {
      const result = await request("/admin/api/donors/" + encodeURIComponent(id));
      setProfile(result);
      setSelectedId(id);
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { loadDonors(); }, [loadDonors]);
  useEffect(() => { loadRetention(); }, [loadRetention]);

  function openCreate() { setEditing({ mode: "create" }); setForm(emptyForm()); setError(""); }
  function openEdit(donor) {
    setEditing({ mode: "edit", id: donor.id });
    setForm({
      name: donor.name || "", email: donor.email || "", phone: donor.phone || "",
      donor_type: donor.donor_type || "individual", organization_name: donor.organization_name || "",
      postal_address: donor.postal_address || "", preferred_contact_method: donor.preferred_contact_method || "email",
      email_opt_in: Boolean(donor.email_opt_in), sms_opt_in: Boolean(donor.sms_opt_in), notes: donor.notes || ""
    });
    setError("");
  }

  async function saveDonor(event) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const creating = editing.mode === "create";
      const result = await request(creating ? "/admin/api/donors" : "/admin/api/donors/" + editing.id, {
        method: creating ? "POST" : "PATCH", body: JSON.stringify(form)
      });
      setEditing(null);
      setNotice(creating ? "Donor profile created." : "Donor profile updated.");
      await loadDonors(); await loadRetention();
      if (result.donor?.id) await loadProfile(result.donor.id);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function saveCommunication(event) {
    event.preventDefault(); if (!selectedId) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request("/admin/api/donors/" + selectedId + "/communications", {
        method: "POST", body: JSON.stringify(communication)
      });
      setCommunication({ channel: "email", direction: "outbound", subject: "", summary: "", outcome: "", follow_up_at: "" });
      setNotice("Communication history saved.");
      await loadProfile(selectedId);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function downloadStatement() {
    if (!selectedId) return;
    setStatementBusy(true); setError("");
    try {
      const query = new URLSearchParams();
      if (statementDates.from) query.set("from", statementDates.from);
      if (statementDates.to) query.set("to", statementDates.to);
      const result = await request("/admin/api/donors/" + selectedId + "/statement?" + query.toString());
      setStatement(result);
    } catch (e) { setError(e.message); }
    finally { setStatementBusy(false); }
  }

  async function downloadCsv() {
    if (!selectedId) return;
    setStatementBusy(true); setError("");
    try {
      const query = new URLSearchParams({ format: "csv" });
      if (statementDates.from) query.set("from", statementDates.from);
      if (statementDates.to) query.set("to", statementDates.to);
      const response = await fetch(API("/admin/api/donors/" + selectedId + "/statement?" + query.toString()), { credentials: "include", cache: "no-store" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not download the statement.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "donor-statement-" + selectedId + ".csv";
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
    finally { setStatementBusy(false); }
  }

  const summary = retention || {};
  return <div className="gom-donors">
    <div className="gom-donor-intro">
      <div><span className="small text-success fw-bold text-uppercase">Relationship management</span>
        <h2>Donor CRM</h2><p>Manage donor profiles, giving history, communications and retention.</p></div>
      {canManage && <button className="btn btn-success" onClick={openCreate}><i className="bi bi-person-plus me-2" />Add donor</button>}
    </div>

    {error && <div className="alert alert-danger alert-dismissible" role="alert">{error}<button className="btn-close" onClick={() => setError("")} aria-label="Dismiss" /></div>}
    {notice && <div className="alert alert-success alert-dismissible" role="status">{notice}<button className="btn-close" onClick={() => setNotice("")} aria-label="Dismiss" /></div>}

    <div className="row g-3 mb-4">
      <div className="col-6 col-xl-3"><Metric title="Donor profiles" value={summary.total_donors} icon="bi-people" detail="All recorded donor profiles" /></div>
      <div className="col-6 col-xl-3"><Metric title="First-time donors" value={summary.first_time_donors} icon="bi-person-plus" detail="One confirmed gift" /></div>
      <div className="col-6 col-xl-3"><Metric title="Returning donors" value={summary.returning_donors} icon="bi-arrow-repeat" detail="More than one confirmed gift" /></div>
      <div className="col-6 col-xl-3"><Metric title="Lapsed donors" value={summary.lapsed_donors} icon="bi-clock-history" detail="No confirmed gift in 12 months" /></div>
    </div>

    <section className="gom-panel">
      <div className="gom-panel-heading"><div><h3>Donor directory</h3><p>Search and filter profiles. Lifetime totals include confirmed gifts only.</p></div><span className="gom-record-count">{donors.length} shown</span></div>
      <div className="gom-toolbar">
        <div className="input-group gom-search"><span className="input-group-text"><i className="bi bi-search" /></span>
          <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone or organisation" aria-label="Search donors" /></div>
        <select className="form-select gom-filter" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by giving status">
          <option value="all">All giving statuses</option><option value="prospect">Prospect</option><option value="first_time">First-time</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="lapsed">Lapsed</option>
        </select>
        <select className="form-select gom-filter" value={type} onChange={e => setType(e.target.value)} aria-label="Filter donor type">
          <option value="all">All donor types</option><option value="individual">Individual</option><option value="corporate">Corporate</option><option value="foundation">Foundation</option><option value="church">Church</option><option value="other">Other</option>
        </select>
        <button className="btn btn-outline-success" onClick={() => { loadDonors(); loadRetention(); }}><i className="bi bi-arrow-clockwise me-1" />Refresh</button>
      </div>
      {loading ? <div className="gom-empty"><span className="spinner-border spinner-border-sm text-success" />Loading donor records…</div> :
        donors.length === 0 ? <div className="gom-empty"><i className="bi bi-people" /><strong>No donors found</strong><span>Try changing your search or add a donor profile.</span></div> :
        <div className="table-responsive gom-table-wrap"><table className="table align-middle gom-table mb-0">
          <thead><tr><th>Donor</th><th>Type</th><th>Giving status</th><th>Confirmed gifts</th><th>Lifetime giving</th><th>Latest gift</th><th className="text-end">Actions</th></tr></thead>
          <tbody>{donors.map(donor => <tr key={donor.id} className={selectedId === donor.id ? "table-success" : ""}>
            <td><button className="gom-donor-name" onClick={() => loadProfile(donor.id)}><strong>{donor.name}</strong><small>{donor.email || donor.phone || "No contact details"}</small></button></td>
            <td>{label(donor.donor_type)}</td><td><span className="badge rounded-pill text-bg-light border">{label(donor.giving_status)}</span></td>
            <td>{donor.confirmed_donation_count || 0}</td>
            <td><div className="small">{money(donor.lifetime_ugx, "UGX")}</div><div className="small text-secondary">{money(donor.lifetime_usd, "USD")}</div></td>
            <td>{date(donor.latest_donation_at)}</td>
            <td className="text-end text-nowrap"><button className="btn btn-sm btn-outline-secondary me-1" onClick={() => loadProfile(donor.id)}>View</button>{canManage && <button className="btn btn-sm btn-outline-success" onClick={() => openEdit(donor)}>Edit</button>}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>

    {profile && <section className="gom-panel gom-donor-profile mt-4" id="donor-profile">
      <div className="gom-panel-heading align-items-start"><div><span className="small text-success fw-bold text-uppercase">Donor profile</span><h3>{profile.donor.name}</h3><p>{profile.donor.email || "No email"} · {profile.donor.phone || "No phone"}</p></div>
        <div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={() => { setProfile(null); setSelectedId(""); setStatement(null); }}>Close</button>{canManage && <button className="btn btn-sm btn-outline-success" onClick={() => openEdit(profile.donor)}>Edit profile</button>}</div></div>
      <GivingTotals donor={profile.donor} />
      <div className="row g-3 mt-1 mb-3">
        <div className="col-md-4"><div className="gom-donor-detail"><small>Giving status</small><strong>{label(profile.donor.giving_status)}</strong></div></div>
        <div className="col-md-4"><div className="gom-donor-detail"><small>Confirmed gifts</small><strong>{profile.donor.confirmed_donation_count || 0}</strong></div></div>
        <div className="col-md-4"><div className="gom-donor-detail"><small>Last donation</small><strong>{date(profile.donor.latest_donation_at)}</strong></div></div>
      </div>
      <div className="gom-donor-subsection"><h4>Contact preferences</h4><p className="small text-secondary mb-0">Preferred channel: {label(profile.donor.preferred_contact_method)} · Email consent: {profile.donor.email_opt_in ? "Yes" : "No"} · SMS consent: {profile.donor.sms_opt_in ? "Yes" : "No"}</p>
        {profile.donor.notes && <p className="mt-2 mb-0">{profile.donor.notes}</p>}</div>

      <div className="gom-donor-subsection"><h4>Donation history</h4>
        {profile.donations?.length ? <div className="table-responsive"><table className="table table-sm align-middle"><thead><tr><th>Date</th><th>Reference</th><th>Purpose</th><th>Amount</th><th>Status</th></tr></thead><tbody>
          {profile.donations.map(gift => <tr key={gift.id}><td>{date(gift.paid_at || gift.created_at)}</td><td>{gift.merchant_reference || gift.provider_reference || "—"}</td><td>{label(gift.purpose)}</td><td>{money(gift.amount, gift.currency)}</td><td><span className="badge text-bg-light">{label(gift.status)}</span></td></tr>)}
        </tbody></table></div> : <p className="text-secondary mb-0">No donations are linked to this profile yet.</p>}
      </div>

      <div className="gom-donor-subsection"><div className="d-flex flex-wrap justify-content-between gap-2"><div><h4>Giving statement</h4><p className="small text-secondary">Only confirmed donations are included. Currency totals are never combined.</p></div>
        <div className="d-flex gap-2 align-items-end flex-wrap"><div><label className="form-label small">From</label><input type="date" className="form-control form-control-sm" value={statementDates.from} onChange={e => setStatementDates({ ...statementDates, from: e.target.value })} /></div><div><label className="form-label small">To</label><input type="date" className="form-control form-control-sm" value={statementDates.to} onChange={e => setStatementDates({ ...statementDates, to: e.target.value })} /></div>
          <button className="btn btn-sm btn-outline-success" disabled={statementBusy} onClick={downloadStatement}>View statement</button><button className="btn btn-sm btn-success" disabled={statementBusy} onClick={downloadCsv}>CSV</button></div></div>
        {statement && <div className="gom-donor-statement mt-3" id="donor-statement"><div className="d-flex justify-content-between align-items-start"><div><h5>Garden of Mercy Foundation</h5><strong>Giving statement · {statement.donor.name}</strong><div className="small text-secondary">{statement.period.from || "All time"} – {statement.period.to || "Present"}</div></div><button className="btn btn-sm btn-outline-secondary d-print-none" onClick={() => window.print()}><i className="bi bi-printer me-1" />Print</button></div>
          <div className="table-responsive mt-3"><table className="table table-sm"><thead><tr><th>Date</th><th>Reference</th><th>Purpose</th><th>Amount</th></tr></thead><tbody>{statement.donations.map(g => <tr key={g.id}><td>{date(g.donation_date)}</td><td>{g.merchant_reference || g.provider_reference || "—"}</td><td>{label(g.purpose)}</td><td>{money(g.amount,g.currency)}</td></tr>)}</tbody></table></div>
          <div className="d-flex flex-wrap gap-3">{Object.entries(statement.totals || {}).map(([currency, amount]) => <strong key={currency}>Total {currency}: {money(amount,currency)}</strong>)}</div>
          <small className="text-secondary">{statement.currencyNote}</small>
        </div>}
      </div>

      <div className="gom-donor-subsection"><h4>Communication history</h4>
        {profile.communications?.length ? <div className="gom-communication-list">{profile.communications.map(item => <article key={item.id}><div className="d-flex justify-content-between flex-wrap gap-2"><strong>{label(item.channel)} · {label(item.direction)}</strong><small>{date(item.created_at)}</small></div>{item.subject && <div className="fw-semibold mt-1">{item.subject}</div>}<p className="mb-1 mt-1">{item.summary}</p>{item.outcome && <small className="text-secondary">Outcome: {item.outcome}</small>}{item.follow_up_at && <div className="small text-success mt-1">Follow-up: {date(item.follow_up_at)}</div>}</article>)}</div> : <p className="text-secondary mb-0">No communication history recorded.</p>}
        {canManage && <form className="gom-communication-form mt-3" onSubmit={saveCommunication}><h5>Record a communication</h5><div className="row g-2">
          <div className="col-6 col-md-3"><label className="form-label small">Channel</label><select className="form-select" value={communication.channel} onChange={e => setCommunication({ ...communication, channel: e.target.value })}><option value="email">Email</option><option value="phone">Phone</option><option value="sms">SMS</option><option value="whatsapp">WhatsApp</option><option value="meeting">Meeting</option><option value="letter">Letter</option><option value="other">Other</option></select></div>
          <div className="col-6 col-md-3"><label className="form-label small">Direction</label><select className="form-select" value={communication.direction} onChange={e => setCommunication({ ...communication, direction: e.target.value })}><option value="outbound">Outbound</option><option value="inbound">Inbound</option></select></div>
          <div className="col-12 col-md-6"><label className="form-label small">Subject</label><input className="form-control" maxLength="180" value={communication.subject} onChange={e => setCommunication({ ...communication, subject: e.target.value })} /></div>
          <div className="col-12"><label className="form-label small">Summary</label><textarea className="form-control" rows="3" maxLength="4000" required value={communication.summary} onChange={e => setCommunication({ ...communication, summary: e.target.value })} /></div>
          <div className="col-12 col-md-6"><label className="form-label small">Outcome</label><input className="form-control" maxLength="1000" value={communication.outcome} onChange={e => setCommunication({ ...communication, outcome: e.target.value })} /></div>
          <div className="col-12 col-md-6"><label className="form-label small">Follow-up reminder</label><input type="datetime-local" className="form-control" value={communication.follow_up_at} onChange={e => setCommunication({ ...communication, follow_up_at: e.target.value })} /></div>
          <div className="col-12"><button className="btn btn-success" disabled={busy}>{busy ? "Saving…" : "Save communication"}</button></div>
        </div></form>}
      </div>
    </section>}

    {editing && <div className="gom-donor-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setEditing(null); }}>
      <section className="gom-donor-modal" role="dialog" aria-modal="true" aria-labelledby="donor-form-title">
        <div className="d-flex justify-content-between align-items-start mb-3"><div><span className="small text-success fw-bold text-uppercase">Donor records</span><h3 className="h5 fw-bold" id="donor-form-title">{editing.mode === "create" ? "Create donor profile" : "Edit donor profile"}</h3></div><button className="btn-close" onClick={() => setEditing(null)} aria-label="Close" /></div>
        <form onSubmit={saveDonor}><div className="row g-3">
          <div className="col-12 col-md-6"><label className="form-label">Full name *</label><input className="form-control" required maxLength="160" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="col-12 col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" maxLength="254" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="col-12 col-md-6"><label className="form-label">Phone</label><input className="form-control" maxLength="40" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="col-12 col-md-6"><label className="form-label">Donor type</label><select className="form-select" value={form.donor_type} onChange={e => setForm({ ...form, donor_type: e.target.value })}><option value="individual">Individual</option><option value="corporate">Corporate</option><option value="foundation">Foundation</option><option value="church">Church</option><option value="other">Other</option></select></div>
          <div className="col-12"><label className="form-label">Organisation name</label><input className="form-control" maxLength="180" value={form.organization_name} onChange={e => setForm({ ...form, organization_name: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Postal address</label><textarea className="form-control" rows="2" maxLength="500" value={form.postal_address} onChange={e => setForm({ ...form, postal_address: e.target.value })} /></div>
          <div className="col-12 col-md-6"><label className="form-label">Preferred contact method</label><select className="form-select" value={form.preferred_contact_method} onChange={e => setForm({ ...form, preferred_contact_method: e.target.value })}><option value="email">Email</option><option value="sms">SMS</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option><option value="none">Do not contact</option></select></div>
          <div className="col-12 col-md-6 d-flex align-items-end gap-3"><label className="form-check"><input className="form-check-input" type="checkbox" checked={form.email_opt_in} onChange={e => setForm({ ...form, email_opt_in: e.target.checked })} /><span className="form-check-label">Email consent</span></label><label className="form-check"><input className="form-check-input" type="checkbox" checked={form.sms_opt_in} onChange={e => setForm({ ...form, sms_opt_in: e.target.checked })} /><span className="form-check-label">SMS consent</span></label></div>
          <div className="col-12"><label className="form-label">Internal staff notes</label><textarea className="form-control" rows="3" maxLength="5000" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </div><div className="d-flex justify-content-end gap-2 mt-4"><button type="button" className="btn btn-light border" onClick={() => setEditing(null)}>Cancel</button><button className="btn btn-success" disabled={busy}>{busy ? "Saving…" : "Save donor"}</button></div></form>
      </section>
    </div>}
  </div>;
}
