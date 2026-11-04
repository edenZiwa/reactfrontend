import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../css/admin.css";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API = (path) => `${API_ORIGIN}${path}`;
const NAV = [
  { group: "Overview", items: [{ id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2", path: "/admin" }] },
  { group: "People & care", items: [
    { id: "users", label: "Staff & users", icon: "bi-people", path: "/admin/users", permission: "users.manage" },
    { id: "beneficiaries", label: "Beneficiaries", icon: "bi-heart-pulse", path: "/admin/beneficiaries", permission: "beneficiaries.view" },
    { id: "sponsorship", label: "Child sponsorship", icon: "bi-mortarboard", path: "/admin/sponsorship", permission: "beneficiaries.view" },
    { id: "volunteers", label: "Volunteer profiles", icon: "bi-person-check", path: "/admin/volunteers", permission: "volunteers.manage" },
    { id: "registrations", label: "Program registrations", icon: "bi-calendar-check", path: "/admin/registrations", permission: "programs.manage" },
    { id: "applications", label: "Applications", icon: "bi-inbox", path: "/admin/applications", permission: "volunteers.manage" },
  ]},
  { group: "Finance", items: [
    { id: "reconciliation", label: "Payment reconciliation", icon: "bi-arrow-left-right", path: "/admin/finance-reconciliation", permission: "donations.manage" },
    { id: "recurring", label: "Recurring giving", icon: "bi-repeat", path: "/admin/recurring-donations", permission: "donations.manage" },
    { id: "reports", label: "Reports & exports", icon: "bi-file-earmark-spreadsheet", path: "/admin/reports", permission: "reports.view" },
  ]},
  { group: "Communications & security", items: [\n    { id: "security", label: "Account security", icon: "bi-shield-lock", path: "/admin/security" },
    { id: "inbox", label: "Contact inbox", icon: "bi-envelope", path: "/admin/contact-inbox", permission: "content.manage" },
    { id: "audit", label: "Audit log", icon: "bi-shield-check", path: "/admin/audit-log", permission: "reports.view" },
  ]},
];
const PAGE = Object.fromEntries(NAV.flatMap(group => group.items.map(item => [item.path, item])));
const ENDPOINTS = {
  users: "/admin/api/users", beneficiaries: "/admin/api/beneficiaries", sponsorship: "/admin/api/sponsorship-profiles",
  volunteers: "/admin/api/volunteer-profiles", registrations: "/admin/api/program-registrations",
  applications: "/admin/api/public-applications", reconciliation: "/admin/api/donations/reconciliation",
  recurring: "/admin/api/recurring-donations", inbox: "/admin/api/contact-messages", audit: "/admin/api/audit",
};
const TITLES = {
  users: "Staff & users", beneficiaries: "Beneficiaries", sponsorship: "Child sponsorship",
  volunteers: "Volunteer profiles", registrations: "Program registrations", applications: "Applications",
  reconciliation: "Payment reconciliation", recurring: "Recurring giving", inbox: "Contact inbox", audit: "Audit log", security: "Account security",
};
const pickRows = (key, data) => {
  if (key === "users") return data.users || [];
  if (key === "beneficiaries") return data.data || [];
  if (key === "sponsorship") return data.profiles || [];
  if (key === "volunteers") return data.profiles || [];
  if (key === "registrations") return data.registrations || [];
  if (key === "applications") return data.applications || [];
  if (key === "reconciliation") return data.donations || [];
  if (key === "recurring") return data.plans || [];
  if (key === "inbox") return data.messages || [];
  return data.logs || [];
};
const fmtDate = (value) => value ? new Date(value).toLocaleString() : "—";
const money = (amount, currency = "UGX") => amount == null ? "—" : new Intl.NumberFormat("en-UG", { style: "currency", currency, maximumFractionDigits: currency === "UGX" ? 0 : 2 }).format(Number(amount));
const titleCase = (value) => String(value || "—").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

async function getCsrf() {
  const response = await fetch(API("/auth/csrf"), { credentials: "include", cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.csrfToken) throw new Error(data.error || "Could not start a secure session.");
  return data.csrfToken;
}
async function api(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers["X-CSRF-Token"] = await getCsrf();
  const response = await fetch(API(path), { ...options, method, headers, credentials: "include", cache: "no-store" });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status}).`);
  return data;
}

function StatusPill({ value }) {
  const status = String(value || "unknown").toLowerCase();
  const tone = ["active", "completed", "approved", "verified", "resolved", "paid"].includes(status) ? "success"
    : ["pending", "initiating", "new", "submitted", "in_progress", "needs_information", "pending_setup"].includes(status) ? "warning"
    : ["failed", "rejected", "cancelled", "reversed", "spam", "inactive"].includes(status) ? "danger" : "secondary";
  return <span className={`badge rounded-pill text-bg-${tone} bg-opacity-10 text-${tone} border border-${tone} border-opacity-25`}>{titleCase(status)}</span>;
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "", mfaCode: "", recoveryCode: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const csrf = await getCsrf();
      const response = await fetch(API("/auth/login"), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json", Accept: "application/json", "X-CSRF-Token": csrf }, body: JSON.stringify({ email: form.email, password: form.password, ...(form.mfaCode ? { mfaCode: form.mfaCode } : {}), ...(form.recoveryCode ? { recoveryCode: form.recoveryCode } : {}) }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "Sign-in failed.");
      await onLogin();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main className="gom-admin-login container-fluid">
    <section className="gom-login-card">
      <img src="/images/garden_of_mercy_icon.png" alt="" />
      <div className="small text-success fw-bold text-uppercase mb-2">Garden of Mercy Foundation</div>
      <h1 className="h3 fw-bold mb-2">Staff administration</h1>
      <p className="text-secondary mb-4">Sign in with your authorised staff account to continue.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={submit}>
        <label className="form-label" htmlFor="admin-email">Email address</label>
        <input id="admin-email" className="form-control form-control-lg mb-3" type="email" autoComplete="username" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <label className="form-label" htmlFor="admin-password">Password</label>
        <input id="admin-password" className="form-control form-control-lg mb-4" type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-success btn-lg w-100" disabled={busy}>{busy ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : "Sign in securely"}</button>
      </form>
      <p className="small text-secondary mt-4 mb-0"><i className="bi bi-shield-lock me-1" /> Staff access is protected by role permissions and session security.</p>
    </section>
  </main>;
}

function DataTable({ rows, columns, onAction, actionLabel, empty = "No records found.", onSelect }) {
  if (!rows.length) return <div className="gom-empty"><i className="bi bi-inbox" /><strong>Nothing to show yet</strong><span>{empty}</span></div>;
  return <div className="table-responsive gom-table-wrap"><table className="table align-middle gom-table mb-0">
    <thead><tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}{(onAction || onSelect) && <th className="text-end">Action</th>}</tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.id || row.merchant_reference || row.reference || index}>
      {columns.map(col => <td key={col.key}>{col.render ? col.render(row) : (row[col.key] ?? "—")}</td>)}
      {(onAction || onSelect) && <td className="text-end text-nowrap">{onSelect && <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onSelect(row)}>View</button>}{onAction && <button className="btn btn-sm btn-outline-success" onClick={() => onAction(row)}>{actionLabel || "Manage"}</button>}</td>}
    </tr>)}</tbody>
  </table></div>;
}

function RecordModal({ record, kind, onClose, onSave, busy, beneficiaryOptions = [] }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    const initial = { ...(record || {}) };
    if (kind === "users") {
      initial.firstName = initial.firstName ?? initial.first_name ?? "";
      initial.lastName = initial.lastName ?? initial.last_name ?? "";
      initial.roleSlug = initial.roleSlug ?? initial.roles?.[0] ?? "staff";
      initial.isActive = String(initial.isActive ?? initial.is_active ?? true);
    }
    setForm(initial);
  }, [record, kind]);
  if (!record) return null;
  const field = (label, key, type = "text", options) => <div className="mb-3" key={key}>
    <label className="form-label" htmlFor={`record-${key}`}>{label}</label>
    {options ? <select id={`record-${key}`} className="form-select" value={form[key] ?? ""} onChange={e => setForm({ ...form, [key]: e.target.value })}>{options.map(v => typeof v === "string" ? <option key={v} value={v}>{titleCase(v)}</option> : <option key={v.value} value={v.value}>{v.label}</option>)}</select>
      : type === "textarea" ? <textarea id={`record-${key}`} className="form-control" rows="4" value={form[key] ?? ""} onChange={e => setForm({ ...form, [key]: e.target.value })} />
      : <input id={`record-${key}`} className="form-control" type={type} value={form[key] ?? ""} onChange={e => setForm({ ...form, [key]: e.target.value })} />}
  </div>;
  let fields = [];
  if (kind === "users") fields = [
    field("First name", "firstName"), field("Last name", "lastName"), field("Email", "email", "email"),
    field("Role", "roleSlug", "text", ["staff","finance","programs","volunteers","communications","admin","super_admin", ...(form.roleSlug && !["staff","finance","programs","volunteers","communications","admin","super_admin"].includes(form.roleSlug) ? [form.roleSlug] : [])]),
    field("Account status", "isActive", "text", ["true", "false"]),
    field(record.id ? "New password (optional, minimum 12 characters)" : "Temporary password (minimum 12 characters)", "password", "password")
  ];
  if (kind === "beneficiaries") fields = [
    ...(!record.id ? [field("Beneficiary code", "beneficiaryCode")] : []),
    field("First name", "first_name"), field("Last name", "last_name"), field("Date of birth", "date_of_birth", "date"),
    field("Sex", "sex"), field("Status", "status", "text", ["active","inactive","graduated","transferred","closed"]),
    field("Consent status", "consent_status", "text", ["pending","granted","withdrawn","not_required"]),
    field("Caregiver name", "primary_caregiver_name"), field("Caregiver phone", "primary_caregiver_phone"),
    field("Education summary", "education_summary", "textarea")
  ];
  if (kind === "inbox") fields = [field("Message status", "status", "text", ["new","in_progress","resolved","spam"])];
  if (kind === "recurring") fields = [field("Plan status", "status", "text", ["pending_setup","paused","cancelled","failed","active"]), field("Payment provider (required to activate)", "provider"), field("Provider subscription ID (required to activate)", "providerSubscriptionId")];
  if (kind === "sponsorship") fields = [
    field("Beneficiary record", "beneficiary_id", "text", beneficiaryOptions),
    field("Public display name", "display_name"), field("Age band", "age_band"),
    field("Region label", "region_label"), field("Education level", "education_level"),
    field("Story", "story", "textarea"), field("Sponsorship amount", "sponsorship_amount", "number"),
    field("Currency", "currency", "text", ["UGX","USD"]), field("Photo URL (consented image only)", "photo_url"),
    field("Publish profile", "published", "text", ["false","true"])
  ];
  if (kind === "reconciliation") fields = [<div className="alert alert-info small" key="note">This action requests a fresh server-to-server payment verification. A browser redirect alone never confirms a donation.</div>];
  if (kind === "volunteers") fields = [field("Review status", "verification_status", "text", ["pending","verified","needs_information","rejected"]), field("Staff note", "review_note", "textarea")];
  if (kind === "registrations") fields = [field("Registration status", "status", "text", ["pending","approved","waitlisted","rejected","completed"]), field("Staff note", "staff_note", "textarea")];
  if (kind === "applications") fields = [field("Application status", "status", "text", ["submitted","under_review","information_requested","approved","rejected"]), field("Staff note", "staff_note", "textarea")];
  return <div className="gom-modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="gom-modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title">
      <div className="d-flex justify-content-between align-items-start mb-3"><div><div className="small text-success fw-bold text-uppercase">Record details</div><h2 className="h5 fw-bold mb-0" id="record-modal-title">{kind === "reconciliation" ? "Verify payment" : kind === "beneficiaries" && !record.id ? "Add beneficiary record" : kind === "users" && !record.id ? "Create staff account" : `Manage ${TITLES[kind] || "record"}`}</h2></div><button className="btn-close" aria-label="Close" onClick={onClose} /></div>
      <div className="gom-modal-content">
        <div className="small text-secondary mb-3">{record.email || record.donor_email || record.merchant_reference || record.beneficiary_code || record.id || ""}</div>
        {kind === "inbox" && <div className="border rounded-3 p-3 mb-3"><strong>{record.subject || "Message"}</strong><p className="mb-0 mt-2 text-secondary" style={{ whiteSpace: "pre-wrap" }}>{record.message}</p></div>}
        {kind === "reconciliation" && <p className="text-secondary">Reference: <strong>{record.merchant_reference}</strong><br />Amount: {money(record.amount, record.currency)}<br />Current status: <StatusPill value={record.status} /></p>}
        {kind === "users" && !record.id && field("Temporary password (minimum 12 characters)", "password", "password")}
        {fields}
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4"><button className="btn btn-light border" onClick={onClose}>Cancel</button><button className="btn btn-success" disabled={busy} onClick={() => onSave(form)}>{busy ? "Saving…" : kind === "reconciliation" ? "Verify with provider" : "Save changes"}</button></div>
    </section>
  </div>;
}

export default function Admin({ path = "/admin", navigate }) {
  const [staff, setStaff] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [data, setData] = useState({});
  const [busy, setBusy] = useState(false);
  const [record, setRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [reportDates, setReportDates] = useState({ from: "", to: "" });
  const current = PAGE[path] || PAGE["/admin"];
  const key = current.id;
  const isDashboard = key === "dashboard";
  const can = useCallback(permission => permissions.includes(permission) || permissions.includes("*"), [permissions]);

  const loadIdentity = useCallback(async () => {
    const me = await api("/admin/api/me");
    setStaff(me.user || null);
    setPermissions(me.permissions || []);
    if (!me.user) throw new Error("Please sign in with an authorised staff account.");
    return me;
  }, []);

  const loadPage = useCallback(async (pageKey = key) => {
    setPageError(""); setNotice("");
    if (pageKey === "dashboard") {
      const result = await api("/admin/api/reports/overview");
      setDashboard(result); return;
    }
    const endpoint = ENDPOINTS[pageKey];
    if (!endpoint) return;
    const query = new URLSearchParams();
    if (pageKey === "inbox") { if (filter !== "all") query.set("status", filter); query.set("limit", "50"); query.set("offset", String(pageNumber * 50)); }
    if (pageKey === "audit") { query.set("limit", "100"); if (search) query.set("action", search); if (reportDates.from) query.set("from", reportDates.from); if (reportDates.to) query.set("to", reportDates.to); }
    if (pageKey === "beneficiaries") { query.set("status", filter === "all" ? "active" : filter); if (search) query.set("q", search); }
    if (pageKey === "users" && search) query.set("search", search);
    const result = await api(endpoint + (query.size ? `?${query}` : ""));
    setData(previous => ({ ...previous, [pageKey]: result }));
  }, [key, filter, pageNumber, search, can, reportDates]);

  useEffect(() => {
    let active = true;
    (async () => {
      try { await loadIdentity(); }
      catch (e) { if (active) setAuthError(e.message); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [loadIdentity]);

  useEffect(() => {
    if (!staff) return;
    const permitted = isDashboard || !current.permission || can(current.permission);
    if (!permitted) { setPageError("Your staff account does not have permission to view this section."); return; }
    loadPage(key).catch(e => setPageError(e.message));
  }, [staff, key, filter, pageNumber, search, current.permission, isDashboard, can, loadPage]);

  const visibleNav = useMemo(() => NAV.map(group => ({ ...group, items: group.items.filter(item => !item.permission || can(item.permission)) })).filter(group => group.items.length), [can]);
  const rows = useMemo(() => pickRows(key, data[key] || {}), [key, data]);
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || ["users","beneficiaries","inbox","audit"].includes(key)) return rows;
    return rows.filter(row => Object.values(row).some(value => String(value ?? "").toLowerCase().includes(q)));
  }, [rows, search, key]);

  async function signOut() {
    try { await api("/auth/logout", { method: "POST" }); }
    catch (e) { setPageError(e.message); return; }
    setStaff(null); setPermissions([]); setAuthError("You have been signed out.");
  }
  async function saveRecord(form) {
    if (!record) return;
    setBusy(true); setPageError(""); setNotice("");
    try {
      let endpoint = ENDPOINTS[key];
      let method = "PATCH";
      let body = {};
      if (key === "users") {
        body = { firstName: form.firstName, lastName: form.lastName, email: form.email, roleSlug: form.roleSlug, isActive: form.isActive !== "false" && form.isActive !== false };
        if (!record.id) { method = "POST"; body.password = form.password; }
        endpoint += record.id ? `/${record.id}` : "";
      } else if (key === "beneficiaries") {
        body = { ...(form.beneficiaryCode ? { beneficiaryCode: form.beneficiaryCode } : {}), firstName: form.first_name, lastName: form.last_name, dateOfBirth: form.date_of_birth || null, sex: form.sex, status: form.status, consentStatus: form.consent_status, primaryCaregiverName: form.primary_caregiver_name, primaryCaregiverPhone: form.primary_caregiver_phone, educationSummary: form.education_summary };
        if (!record.id) { method = "POST"; } else { endpoint += `/${record.id}`; }
      } else if (key === "sponsorship") {
        endpoint = ENDPOINTS.sponsorship; method = "POST";
        body = { beneficiaryId: form.beneficiary_id, displayName: form.display_name, ageBand: form.age_band, regionLabel: form.region_label, educationLevel: form.education_level, story: form.story, sponsorshipAmount: Number(form.sponsorship_amount), currency: form.currency || "UGX", photoUrl: form.photo_url, published: form.published === "true" || form.published === true };
      } else if (key === "inbox") { endpoint += `/${record.id}`; body = { status: form.status }; }
      else if (key === "recurring") { endpoint += `/${record.id}`; body = { status: form.status, provider: form.provider, providerSubscriptionId: form.providerSubscriptionId }; }
      else if (key === "volunteers") { endpoint += `/${record.user_id}/review`; body = { status: form.verification_status, note: form.review_note }; }
      else if (key === "registrations") { endpoint += `/${record.id}/review`; body = { status: form.status, note: form.staff_note }; }
      else if (key === "applications") { endpoint += `/${record.id}/review`; body = { status: form.status, note: form.staff_note }; }
      else if (key === "reconciliation") {
        const result = await api(`/admin/api/donations/${encodeURIComponent(record.merchant_reference)}/verify`, { method: "POST" });
        setNotice(`Verification completed. Current status: ${titleCase(result.status)}.`); setRecord(null); await loadPage(key); return;
      }
      await api(endpoint, { method, body: JSON.stringify(body) });
      setNotice("Changes saved successfully."); setRecord(null); await loadPage(key);
    } catch (e) { setPageError(e.message); } finally { setBusy(false); }
  }

  async function downloadCsv() {
    try {
      const query = new URLSearchParams();
      if (reportDates.from) query.set("from", reportDates.from);
      if (reportDates.to) query.set("to", reportDates.to);
      const response = await fetch(API(`/admin/api/reports/donations.csv?${query}`), { credentials: "include", cache: "no-store" });
      if (!response.ok) { const d = await response.json().catch(() => ({})); throw new Error(d.error || "Could not export report."); }
      const blob = await response.blob(); const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "garden-of-mercy-donations.csv"; anchor.click(); URL.revokeObjectURL(url);
    } catch (e) { setPageError(e.message); }
  }

  if (loading) return <main className="gom-admin-loading"><span className="spinner-border text-success" /><p>Checking staff access…</p></main>;
  if (!staff) return <Login onLogin={async () => { setLoading(true); setAuthError(""); try { await loadIdentity(); } catch (e) { setAuthError(e.message); } finally { setLoading(false); } }} />;

  const headerTitle = isDashboard ? "Good day" : current.label;
  const columnsByKey = {
    users: [
      { key: "first_name", label: "Staff member", render: r => <div><strong>{[r.first_name,r.last_name].filter(Boolean).join(" ") || r.email}</strong><div className="small text-secondary">{r.email}</div></div> },
      { key: "role", label: "Role", render: r => titleCase(r.role_slug || r.role || r.roles?.[0]) },
      { key: "status", label: "Status", render: r => <StatusPill value={r.is_active === false || r.status === "inactive" ? "inactive" : "active"} /> },
    ],
    beneficiaries: [
      { key: "beneficiary_code", label: "Reference" }, { key: "first_name", label: "Beneficiary", render: r => [r.first_name,r.last_name].filter(Boolean).join(" ") },
      { key: "status", label: "Status", render: r => <StatusPill value={r.status} /> }, { key: "consent_status", label: "Consent", render: r => <StatusPill value={r.consent_status} /> },
    ],
    sponsorship: [
      { key: "display_name", label: "Public display name" }, { key: "region_label", label: "Region" }, { key: "sponsorship_amount", label: "Support amount", render: r => money(r.sponsorship_amount,r.currency) },
      { key: "published", label: "Publication", render: r => <StatusPill value={r.published ? "published" : "unpublished"} /> }, { key: "story_consent_current", label: "Story consent", render: r => <StatusPill value={r.story_consent_current ? "verified" : "missing"} /> },
    ],
    volunteers: [
      { key: "name", label: "Volunteer", render: r => <div><strong>{[r.first_name,r.last_name].filter(Boolean).join(" ")}</strong><div className="small text-secondary">{r.email}</div></div> },
      { key: "location", label: "Location" }, { key: "verification_status", label: "Review", render: r => <StatusPill value={r.verification_status} /> },
    ],
    registrations: [
      { key: "program_name", label: "Program" }, { key: "email", label: "Applicant" }, { key: "created_at", label: "Received", render: r => fmtDate(r.created_at) }, { key: "status", label: "Status", render: r => <StatusPill value={r.status} /> },
    ],
    applications: [
      { key: "title", label: "Application" }, { key: "email", label: "Applicant" }, { key: "type", label: "Type", render: r => titleCase(r.type) }, { key: "status", label: "Status", render: r => <StatusPill value={r.status} /> },
    ],
    reconciliation: [
      { key: "merchant_reference", label: "Reference" }, { key: "donor_name", label: "Donor" }, { key: "amount", label: "Amount", render: r => money(r.amount,r.currency) }, { key: "status", label: "Status", render: r => <StatusPill value={r.status} /> }, { key: "created_at", label: "Created", render: r => fmtDate(r.created_at) },
    ],
    recurring: [
      { key: "donor_name", label: "Donor", render: r => <div><strong>{r.donor_name}</strong><div className="small text-secondary">{r.donor_email}</div></div> }, { key: "amount", label: "Amount", render: r => money(r.amount,r.currency) }, { key: "purpose", label: "Purpose", render: r => titleCase(r.purpose) }, { key: "status", label: "Plan status", render: r => <StatusPill value={r.status} /> },
    ],
    inbox: [
      { key: "name", label: "Sender", render: r => <div><strong>{r.name}</strong><div className="small text-secondary">{r.email}</div></div> }, { key: "subject", label: "Subject" }, { key: "created_at", label: "Received", render: r => fmtDate(r.created_at) }, { key: "status", label: "Status", render: r => <StatusPill value={r.status} /> },
    ],
    audit: [
      { key: "created_at", label: "Time", render: r => fmtDate(r.created_at) }, { key: "actor_email", label: "Staff member" }, { key: "action", label: "Action" }, { key: "resource_type", label: "Resource" }, { key: "resource_id", label: "Reference" },
    ],
  };
  const actionKinds = ["users","beneficiaries","sponsorship","volunteers","registrations","applications","reconciliation","recurring","inbox"];
  const canManage = actionKinds.includes(key) && (key !== "sponsorship" || can("beneficiaries.update"));
  return <div className="gom-admin">
    <aside className="gom-admin-sidebar">
      <a href="/" className="gom-admin-brand"><img src="/images/garden_of_mercy_icon.png" alt="" /><span><strong>Garden of Mercy</strong><small>Administration</small></span></a>
      <div className="gom-admin-nav">
        {visibleNav.map(group => <div className="mb-4" key={group.group}><div className="gom-nav-label">{group.group}</div>{group.items.map(item => <button key={item.id} className={`gom-nav-link ${key === item.id ? "active" : ""}`} onClick={() => navigate(item.path)}><i className={`bi ${item.icon}`} /><span>{item.label}</span></button>)}</div>)}
      </div>
      <div className="gom-sidebar-footer"><div className="gom-user-chip"><span className="gom-avatar">{(staff.firstName || staff.first_name || staff.email || "S").charAt(0).toUpperCase()}</span><span className="text-truncate"><strong>{staff.fullName || [staff.first_name,staff.last_name].filter(Boolean).join(" ") || "Staff account"}</strong><small>{staff.email}</small></span></div><button className="btn btn-sm btn-outline-secondary w-100 mt-3" onClick={signOut}><i className="bi bi-box-arrow-right me-2" />Sign out</button><a className="gom-back-site" href="/">← Back to public website</a></div>
    </aside>
    <main className="gom-admin-main">
      <header className="gom-admin-topbar"><div><div className="small text-secondary">Garden of Mercy Foundation / Administration</div><h1>{headerTitle}{isDashboard && <span className="text-success">, {staff.firstName || staff.first_name || "team"}</span>}</h1></div><div className="d-flex align-items-center gap-2"><span className="gom-secure-label"><i className="bi bi-shield-check me-1" />Secure staff area</span><button className="btn btn-light border d-lg-none" onClick={() => navigate("/")}>Website</button></div></header>
      <div className="gom-admin-content">
        {authError && <div className="alert alert-warning">{authError}</div>}
        {pageError && <div className="alert alert-danger d-flex justify-content-between align-items-start"><span>{pageError}</span><button className="btn-close" aria-label="Dismiss" onClick={() => setPageError("")} /></div>}
        {notice && <div className="alert alert-success alert-dismissible">{notice}<button className="btn-close" onClick={() => setNotice("")} /></div>}
        {isDashboard ? <Dashboard data={dashboard} navigate={navigate} can={can} reload={() => loadPage("dashboard").catch(e => setPageError(e.message))} /> :
          key === "security" ? <SecurityPanel /> : key === "reports" ? <section className="gom-panel"><div className="gom-panel-heading"><div><h2>Donation report export</h2><p>Download a date-bounded CSV report for finance review.</p></div><i className="bi bi-file-earmark-arrow-down" /></div><div className="row g-3 align-items-end"><div className="col-sm-4"><label className="form-label">From date</label><input type="date" className="form-control" value={reportDates.from} onChange={e => setReportDates({ ...reportDates, from: e.target.value })} /></div><div className="col-sm-4"><label className="form-label">To date</label><input type="date" className="form-control" value={reportDates.to} onChange={e => setReportDates({ ...reportDates, to: e.target.value })} /></div><div className="col-sm-4"><button className="btn btn-success w-100" onClick={downloadCsv}><i className="bi bi-download me-2" />Export donations CSV</button></div></div><p className="small text-secondary mt-3 mb-0">Exports are limited by the backend and include donor contact details. Store downloaded files securely.</p></section> :
          <section className="gom-panel">
            <div className="gom-panel-heading"><div><h2>{TITLES[key] || current.label}</h2><p>{key === "reconciliation" ? "Review unsettled payments and request a fresh provider verification." : key === "audit" ? "A traceable record of staff and system actions." : key === "sponsorship" ? "Manage public-facing child profiles. Publication is guarded by current consent." : "Review, search and manage records within your assigned permissions."}</p></div><span className="gom-record-count">{filteredRows.length} records</span></div>
            <div className="gom-toolbar"><div className="input-group gom-search"><span className="input-group-text"><i className="bi bi-search" /></span><input className="form-control" placeholder={key === "audit" ? "Search action…" : "Search this list…"} value={search} onChange={e => { setSearch(e.target.value); setPageNumber(0); }} /></div>
              {["beneficiaries","inbox"].includes(key) && <select className="form-select gom-filter" value={filter} onChange={e => { setFilter(e.target.value); setPageNumber(0); }}><option value="active">Active</option>{(key === "beneficiaries" ? ["inactive","graduated","transferred","closed"] : ["new","in_progress","resolved","spam"]).map(v => <option key={v} value={v}>{titleCase(v)}</option>)}</select>}
              <button className="btn btn-outline-success" onClick={() => loadPage(key).catch(e => setPageError(e.message))}><i className="bi bi-arrow-clockwise me-1" />Refresh</button>
              {key === "users" && can("users.manage") && <button className="btn btn-success" onClick={() => setRecord({})}><i className="bi bi-plus-lg me-1" />Add staff</button>}
              {key === "sponsorship" && can("beneficiaries.update") && <button className="btn btn-success" onClick={() => setRecord({ currency: "UGX", age_band: "School age", region_label: "Uganda", published: false })}><i className="bi bi-plus-lg me-1" />Add profile</button>}\n              {key === "beneficiaries" && can("beneficiaries.create") && <button className="btn btn-success" onClick={() => setRecord({})}><i className="bi bi-plus-lg me-1" />Add beneficiary</button>}
            </div>
            {key === "audit" && <div className="row g-2 mb-3"><div className="col-sm-4"><label className="form-label small" htmlFor="audit-from">From</label><input id="audit-from" type="date" className="form-control form-control-sm" value={reportDates.from} onChange={e => setReportDates({ ...reportDates, from: e.target.value })} /></div><div className="col-sm-4"><label className="form-label small" htmlFor="audit-to">To</label><input id="audit-to" type="date" className="form-control form-control-sm" value={reportDates.to} onChange={e => setReportDates({ ...reportDates, to: e.target.value })} /></div><div className="col-sm-4 d-flex align-items-end"><button className="btn btn-sm btn-outline-success w-100" onClick={() => loadPage(key).catch(e => setPageError(e.message))}>Apply date range</button></div></div>}\n            {key === "sponsorship" && <div className="alert alert-info small"><i className="bi bi-info-circle me-2" />Only profiles with valid story consent and an active beneficiary record can be published. Private legal names and case notes are not displayed here.</div>}
            <DataTable rows={filteredRows} columns={columnsByKey[key] || []} onAction={canManage ? row => setRecord(row) : null} actionLabel={key === "reconciliation" ? "Verify" : key === "inbox" ? "Open" : "Manage"} onSelect={key === "inbox" ? row => setRecord(row) : null} empty={key === "reconciliation" ? "There are no payments awaiting verification." : "No records match these filters."} />
            {key === "inbox" && <div className="d-flex justify-content-between align-items-center pt-3"><span className="small text-secondary">Page {pageNumber + 1}</span><div className="btn-group"><button className="btn btn-sm btn-outline-secondary" disabled={pageNumber === 0} onClick={() => setPageNumber(p => Math.max(0,p-1))}>Previous</button><button className="btn btn-sm btn-outline-secondary" disabled={rows.length < 50} onClick={() => setPageNumber(p => p+1)}>Next</button></div></div>}
          </section>}
      </div>
    </main>
    <RecordModal record={record} kind={key} onClose={() => setRecord(null)} onSave={saveRecord} busy={busy} beneficiaryOptions={data.beneficiaryOptions || []} />
  </div>;
}

function Dashboard({ data, navigate, can, reload }) {
  const d = data?.donations || {}, b = data?.beneficiaries || {}, u = data?.users || {};
  const cards = [
    { label: "Confirmed giving", value: money(d.received, "UGX"), note: `${d.successful || 0} successful payments`, icon: "bi-heart" },
    { label: "Giving this month", value: money(d.received_this_month, "UGX"), note: "Confirmed donations only", icon: "bi-calendar-heart" },
    { label: "Beneficiaries", value: b.total ?? "—", note: `${b.active || 0} active records`, icon: "bi-people" },
    { label: "Registered users", value: u.total ?? "—", note: `${u.active || 0} active accounts`, icon: "bi-person-check" },\n    { label: "Payments awaiting review", value: d.pending ?? "—", note: "Initiating or pending", icon: "bi-hourglass-split" },\n    { label: "Consent follow-up", value: b.consent_pending ?? "—", note: "Beneficiary records", icon: "bi-clipboard-heart" },
  ];
  return <div className="gom-dashboard">
    <div className="gom-welcome-banner"><div><span className="small text-uppercase fw-bold">Your work makes a difference</span><h2>Welcome to your workspace</h2><p>Keep the foundation’s programmes, people and resources moving forward.</p></div><div className="gom-welcome-art"><i className="bi bi-flower1" /></div></div>
    <div className="row g-3 mb-4">{cards.map(card => <div className="col-12 col-sm-6 col-xl-3" key={card.label}><article className="gom-stat-card"><div className="d-flex justify-content-between"><span>{card.label}</span><i className={`bi ${card.icon}`} /></div><strong>{card.value}</strong><small>{card.note}</small></article></div>)}</div>
    <div className="row g-4"><div className="col-xl-8"><section className="gom-panel h-100"><div className="gom-panel-heading"><div><h2>Recent donations</h2><p>Latest activity from the donation ledger.</p></div><button className="btn btn-sm btn-outline-secondary" onClick={reload}><i className="bi bi-arrow-clockwise" /></button></div><DataTable rows={data?.recentDonations || []} columns={[{key:"merchant_reference",label:"Reference"},{key:"purpose",label:"Purpose",render:r=>titleCase(r.purpose)},{key:"amount",label:"Amount",render:r=>money(r.amount,r.currency)},{key:"status",label:"Status",render:r=><StatusPill value={r.status}/>},{key:"created_at",label:"Date",render:r=>fmtDate(r.created_at)}]} empty="New donation activity will appear here." /></section></div><div className="col-xl-4"><section className="gom-panel h-100"><div className="gom-panel-heading"><div><h2>Quick access</h2><p>Common staff tasks.</p></div></div><div className="gom-quick-links">{[
      ...(can("donations.manage") ? [{label:"Payment reconciliation",path:"/admin/finance-reconciliation",icon:"bi-arrow-left-right"}] : []),
      ...(can("beneficiaries.view") ? [{label:"Beneficiary records",path:"/admin/beneficiaries",icon:"bi-heart-pulse"}] : []),
      ...(can("content.manage") ? [{label:"Contact inbox",path:"/admin/contact-inbox",icon:"bi-envelope"}] : []),
      ...(can("reports.view") ? [{label:"Audit log",path:"/admin/audit-log",icon:"bi-shield-check"}] : []),
      ...(can("users.manage") ? [{label:"Manage staff",path:"/admin/users",icon:"bi-people"}] : []),
    ].map(item=><button key={item.path} onClick={()=>navigate(item.path)}><i className={`bi ${item.icon}`} /><span>{item.label}</span><i className="bi bi-chevron-right ms-auto" /></button>)}</div></section></div></div>
    <div className="gom-dashboard-footnote"><i className="bi bi-shield-lock me-2" />Dashboard totals are aggregate reporting data. Donor and beneficiary private details are available only in permission-controlled sections.</div>
  </div>;
}

function SecurityPanel() {
  const [secret, setSecret] = useState("");
  const [uri, setUri] = useState("");
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function setup() {
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await api("/auth/mfa/setup", { method: "POST", body: JSON.stringify({}) });
      setSecret(result.secret); setUri(result.otpauthUrl); setMessage(result.message || "Add this account to an authenticator app.");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function enable() {
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await api("/auth/mfa/enable", { method: "POST", body: JSON.stringify({ code }) });
      setRecoveryCodes(result.recoveryCodes || []); setSecret(""); setUri(""); setCode(""); setMessage(result.message || "Multi-factor authentication enabled.");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function disable() {
    if (!window.confirm("Disable multi-factor authentication for this staff account?")) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await api("/auth/mfa/disable", { method: "POST", body: JSON.stringify({ code }) });
      setCode(""); setRecoveryCodes([]); setMessage("Multi-factor authentication has been disabled.");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <section className="gom-panel">
    <div className="gom-panel-heading"><div><h2>Protect your staff account</h2><p>Use an authenticator app and one-time recovery codes to add another layer of security.</p></div><i className="bi bi-shield-lock" /></div>
    {error && <div className="alert alert-danger">{error}</div>}
    {message && <div className="alert alert-info">{message}</div>}
    <div className="row g-4">
      <div className="col-lg-6"><div className="border rounded-3 p-3 h-100">
        <h3 className="h6 fw-bold">Set up an authenticator</h3>
        <p className="small text-secondary">Generate a secret, add it to Google Authenticator, Microsoft Authenticator or another TOTP app, then confirm with the six-digit code.</p>
        <button className="btn btn-outline-success" disabled={busy} onClick={setup}><i className="bi bi-key me-2" />Generate setup secret</button>
        {secret && <div className="mt-3"><label className="form-label small fw-bold">Manual setup key</label><code className="d-block p-3 bg-light rounded-3 text-break">{secret}</code><label className="form-label small fw-bold mt-3">Authenticator setup URI</label><textarea className="form-control" rows="3" readOnly value={uri} /><p className="small text-secondary mt-2 mb-0">Treat this key like a password. Do not share it or save it in a public place.</p></div>}
      </div></div>
      <div className="col-lg-6"><div className="border rounded-3 p-3 h-100">
        <h3 className="h6 fw-bold">Confirm or disable MFA</h3>
        <label className="form-label" htmlFor="staff-mfa-code">Current six-digit authenticator code</label>
        <input id="staff-mfa-code" className="form-control mb-3" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={code} onChange={e => setCode(e.target.value.replace(/\\D/g,"").slice(0,6))} placeholder="000000" />
        <div className="d-flex flex-wrap gap-2"><button className="btn btn-success" disabled={busy || code.length !== 6 || !secret} onClick={enable}>Enable MFA</button><button className="btn btn-outline-danger" disabled={busy || code.length !== 6} onClick={disable}>Disable MFA</button></div>
        <p className="small text-secondary mt-3 mb-0">If MFA is already enabled, enter a current code to disable it before replacing an authenticator device.</p>
      </div></div>
    </div>
    {recoveryCodes.length > 0 && <div className="alert alert-warning mt-4"><strong>Save these recovery codes now.</strong><p className="small mb-2">Each code can be used once. They will not be shown again.</p><div className="row g-2">{recoveryCodes.map(item => <div className="col-6 col-md-4" key={item}><code className="d-block bg-white rounded p-2">{item}</code></div>)}</div><button className="btn btn-sm btn-outline-dark mt-3" onClick={() => { const blob = new Blob([recoveryCodes.join("\\n")], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "garden-of-mercy-recovery-codes.txt"; a.click(); URL.revokeObjectURL(url); }}>Download recovery codes</button></div>}
  </section>;
}
