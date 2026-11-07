import React, { useCallback, useEffect, useState } from "react";
import { API_ORIGIN } from "../../services/api-config.js";

const API = (path) => `${API_ORIGIN}${path}`;

async function getCsrf() {
  const response = await fetch(API("/auth/csrf"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.csrfToken) throw new Error(data.error || "Your staff session has expired. Sign in again.");
  return data.csrfToken;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.headers || {}) };
  if (options.body) headers["Content-Type"] = "application/json";
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers["X-CSRF-Token"] = await getCsrf();
  let response;
  try {
    response = await fetch(API(path), { ...options, method, headers, credentials: "include", cache: "no-store" });
  } catch {
    throw new Error("We could not reach security monitoring. Check your connection and try again.");
  }
  const type = response.headers.get("content-type") || "";
  const data = type.toLowerCase().includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    const messages = {
      401: "Your staff session has expired. Sign in again.",
      403: "Your account does not have permission to view security events.",
      429: "Too many requests. Wait a moment before refreshing.",
    };
    throw new Error(data.error || data.message || messages[response.status] || "Security monitoring could not complete this request.");
  }
  if (response.status !== 204 && !type.toLowerCase().includes("application/json")) throw new Error("Security monitoring returned an unexpected response.");
  return data;
}

const dateTime = (value) => value ? new Date(value).toLocaleString() : "—";
const severityClass = (severity) => ({
  critical: "danger",
  high: "danger",
  medium: "warning",
  low: "secondary",
}[String(severity || "").toLowerCase()] || "secondary");

export default function SecurityMonitoring() {
  const [summary, setSummary] = useState(null);
  const [topTypes, setTopTypes] = useState([]);
  const [events, setEvents] = useState([]);
  const [severity, setSeverity] = useState("");
  const [eventType, setEventType] = useState("");
  const [offset, setOffset] = useState(0);
  const [busy, setBusy] = useState(false);
  const [acknowledging, setAcknowledging] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const limit = 50;

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setBusy(true);
    setError("");
    try {
      const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (severity) query.set("severity", severity);
      if (eventType.trim()) query.set("eventType", eventType.trim());
      const [overview, listing] = await Promise.all([
        request("/admin/api/security/summary"),
        request(`/admin/api/security/events?${query.toString()}`),
      ]);
      setSummary(overview.summary || {});
      setTopTypes(overview.topEventTypes || []);
      setEvents(listing.events || []);
    } catch (e) {
      setError(e.message || "Could not load security events.");
    } finally {
      if (!quiet) setBusy(false);
    }
  }, [severity, eventType, offset]);

  useEffect(() => {
    load();
  }, [load]);

  async function acknowledge(id) {
    setAcknowledging(id);
    setError("");
    setNotice("");
    try {
      await request(`/admin/api/security/events/${encodeURIComponent(id)}/acknowledge`, { method: "PATCH", body: JSON.stringify({}) });
      setNotice("Security event acknowledged. The event remains in the audit history.");
      await load({ quiet: true });
    } catch (e) {
      setError(e.message || "Could not acknowledge this event.");
    } finally {
      setAcknowledging("");
    }
  }

  const cards = [
    { label: "Events · last 24 hours", value: summary?.last_24h ?? "—", icon: "bi-activity" },
    { label: "High priority · last 24 hours", value: summary?.high_priority_24h ?? "—", icon: "bi-exclamation-triangle" },
    { label: "Events · last 7 days", value: summary?.last_7d ?? "—", icon: "bi-calendar-week" },
    { label: "Unacknowledged high priority", value: summary?.unacknowledged_high ?? "—", icon: "bi-bell" },
  ];

  return <section className="gom-panel gom-security-monitoring">
    <div className="gom-panel-heading flex-wrap">
      <div>
        <h2>Security monitoring</h2>
        <p>Review authentication failures, access denials, rate limits and service errors.</p>
      </div>
      <button type="button" className="btn btn-outline-success" onClick={() => load()} disabled={busy}>
        <i className={`bi bi-arrow-clockwise me-2 ${busy ? "gom-spin" : ""}`} />Refresh events
      </button>
    </div>

    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {notice && <div className="alert alert-success" role="status">{notice}</div>}

    <div className="row g-3 mb-4">
      {cards.map(card => <div className="col-12 col-sm-6 col-xl-3" key={card.label}>
        <article className="gom-stat-card h-100">
          <div className="d-flex justify-content-between gap-2"><span>{card.label}</span><i className={`bi ${card.icon}`} /></div>
          <strong>{card.value}</strong>
          <small>Based on recorded security events</small>
        </article>
      </div>)}
    </div>

    <div className="row g-3 mb-4">
      <div className="col-12 col-lg-5">
        <div className="border rounded-3 p-3 h-100">
          <h3 className="h6 fw-bold mb-3">Most frequent event types · 7 days</h3>
          {topTypes.length ? <ul className="list-group list-group-flush">
            {topTypes.map(item => <li className="list-group-item px-0 d-flex justify-content-between gap-3" key={item.event_type}>
              <span className="text-break">{String(item.event_type).replaceAll(".", " · ").replaceAll("_", " ")}</span>
              <strong>{item.count}</strong>
            </li>)}
          </ul> : <p className="small text-secondary mb-0">No events have been recorded in this period.</p>}
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="border rounded-3 p-3 h-100">
          <h3 className="h6 fw-bold mb-2">Monitoring and privacy</h3>
          <p className="small text-secondary mb-2">Event records use hashed network and login identifiers. Passwords, session identifiers and request bodies are not displayed here.</p>
          <p className="small text-secondary mb-0">Acknowledging an event records that it has been reviewed; it does not delete the event or automatically resolve the underlying issue.</p>
        </div>
      </div>
    </div>

    <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
      <div className="flex-grow-1 gom-security-filter-field">
        <label className="form-label small fw-semibold" htmlFor="security-event-type">Event type</label>
        <input id="security-event-type" className="form-control" value={eventType} maxLength={120} placeholder="e.g. auth.login_failed" onChange={e => { setEventType(e.target.value); setOffset(0); }} />
      </div>
      <div>
        <label className="form-label small fw-semibold" htmlFor="security-severity">Severity</label>
        <select id="security-severity" className="form-select" value={severity} onChange={e => { setSeverity(e.target.value); setOffset(0); }}>
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button type="button" className="btn btn-outline-secondary" onClick={() => { setSeverity(""); setEventType(""); setOffset(0); }}>Clear filters</button>
    </div>

    <div className="table-responsive gom-table-wrap">
      <table className="table align-middle gom-table mb-0">
        <thead><tr><th>Time</th><th>Event</th><th>Severity</th><th>Route / status</th><th>Request ID</th><th>Review</th></tr></thead>
        <tbody>
          {events.map(event => <tr key={event.id}>
            <td className="text-nowrap small">{dateTime(event.created_at)}</td>
            <td><strong className="d-block">{String(event.event_type || "unknown").replaceAll(".", " · ").replaceAll("_", " ")}</strong><small className="text-secondary">{event.actor_user_id ? `Staff user · ${event.actor_user_id}` : "Unauthenticated or system request"}</small></td>
            <td><span className={`badge text-bg-${severityClass(event.severity)} bg-opacity-10 text-${severityClass(event.severity)} border border-opacity-25`}>{String(event.severity || "unknown").toUpperCase()}</span></td>
            <td><span className="d-block small text-break">{event.route_template || "Unmatched route"}</span><small className="text-secondary">{event.http_method || "—"} · {event.http_status || "—"}</small></td>
            <td><code className="small">{event.request_id || "—"}</code></td>
            <td>{event.acknowledged_at
              ? <span className="badge text-bg-success bg-opacity-10 text-success border border-success border-opacity-25">Acknowledged</span>
              : <button type="button" className="btn btn-sm btn-outline-success" disabled={acknowledging === event.id} onClick={() => acknowledge(event.id)}>{acknowledging === event.id ? "Saving…" : "Acknowledge"}</button>}</td>
          </tr>)}
          {!events.length && <tr><td colSpan="6" className="text-center text-secondary py-5">{busy ? "Loading security events…" : "No security events match these filters."}</td></tr>}
        </tbody>
      </table>
    </div>

    <div className="d-flex justify-content-between align-items-center gap-2 mt-3">
      <span className="small text-secondary">Showing {events.length} events · page {Math.floor(offset / limit) + 1}</span>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-outline-secondary" disabled={offset === 0 || busy} onClick={() => setOffset(value => Math.max(0, value - limit))}>Previous</button>
        <button type="button" className="btn btn-sm btn-outline-secondary" disabled={events.length < limit || busy} onClick={() => setOffset(value => value + limit)}>Next</button>
      </div>
    </div>
  </section>;
}
