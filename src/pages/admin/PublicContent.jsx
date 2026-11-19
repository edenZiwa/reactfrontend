import React, { useCallback, useEffect, useState } from "react";
import { API_ORIGIN } from "../../services/api-config.js";

const API = (path) => API_ORIGIN + path;

async function getCsrf() {
  const response = await fetch(API("/auth/csrf"), { credentials: "include", cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.csrfToken) throw new Error(data.error || "Your staff session has expired. Sign in again.");
  return data.csrfToken;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) };
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers["X-CSRF-Token"] = await getCsrf();
  let response;
  try {
    response = await fetch(API(path), { ...options, method, headers, credentials: "include", cache: "no-store" });
  } catch {
    throw new Error("We could not reach the content service. Check your connection and try again.");
  }
  const type = response.headers.get("content-type") || "";
  const data = type.toLowerCase().includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    if (response.status === 403) throw new Error("You do not have permission to manage public content, or your staff session needs refreshing. Sign out and back in; if this continues, ask a super administrator to grant the content.manage permission.");
    if (response.status === 404) throw new Error("This content item no longer exists. Refresh the list and try again.");
    throw new Error(data.error || data.message || "The content request could not be completed.");
  }
  return data;
}

const emptyGallery = { title: "", category: "community", caption: "", mediaUrl: "", mediaType: "image", altText: "", locationLabel: "", displayOrder: "0", consentVerified: false, isPublished: false };
const emptyStory = { title: "", category: "community", excerpt: "", body: "", imageUrl: "", imageAlt: "", attribution: "", displayOrder: "0", consentVerified: false, isPublished: false };

export default function PublicContent() {
  const [tab, setTab] = useState("gallery");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyGallery);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const endpoint = tab === "gallery" ? "/admin/api/public-content/gallery" : "/admin/api/public-content/stories";
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await request(endpoint);
      setItems(tab === "gallery" ? (data.items || []) : (data.stories || []));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [endpoint, tab]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    setEditing(null);
    setForm(tab === "gallery" ? emptyGallery : emptyStory);
  }, [tab]);

  function update(name, value) {
    setForm(previous => {
      const next = { ...previous, [name]: value };
      if (name === "consentVerified" && value === false) next.isPublished = false;
      return next;
    });
  }

  const galleryUrlValid = (() => {
    if (!form.mediaUrl.trim()) return false;
    const value = form.mediaUrl.trim();
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try { return new URL(value).protocol === "https:"; } catch { return false; }
  })();

  const storyImageUrlValid = (() => {
    if (!form.imageUrl.trim()) return true;
    const value = form.imageUrl.trim();
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try { return new URL(value).protocol === "https:"; } catch { return false; }
  })();

  function edit(item) {
    setEditing(item);
    if (tab === "gallery") setForm({
      title: item.title || "", category: item.category || "community", caption: item.caption || "",
      mediaUrl: item.media_url || "", mediaType: item.media_type || "image", altText: item.alt_text || "",
      locationLabel: item.location_label || "", displayOrder: String(item.display_order ?? 0),
      consentVerified: Boolean(item.consent_verified), isPublished: Boolean(item.is_published),
    });
    else setForm({
      title: item.title || "", category: item.category || "community", excerpt: item.excerpt || "",
      body: item.body || "", imageUrl: item.image_url || "", imageAlt: item.image_alt || "",
      attribution: item.attribution || "", displayOrder: String(item.display_order ?? 0),
      consentVerified: Boolean(item.consent_verified), isPublished: Boolean(item.is_published),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const path = endpoint + (editing ? "/" + encodeURIComponent(editing.id) : "");
      const data = await request(path, { method: editing ? "PATCH" : "POST", body: JSON.stringify(form) });
      setNotice(editing ? "Content updated." : "Draft created.");
      setEditing(null);
      setForm(tab === "gallery" ? emptyGallery : emptyStory);
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function remove(item) {
    if (!window.confirm("Delete this content item permanently?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request(endpoint + "/" + encodeURIComponent(item.id), { method: "DELETE" });
      if (editing?.id === item.id) {
        setEditing(null);
        setForm(tab === "gallery" ? emptyGallery : emptyStory);
      }
      setNotice("Content item deleted.");
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <section className="gom-panel">
      <div className="gom-panel-heading">
        <div><h2>Public content library</h2><p>Manage gallery media and approved success stories. Publication requires verified consent and a review.</p></div>
        <i className="bi bi-journal-richtext" aria-hidden="true" />
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      <div className="btn-group flex-wrap mb-4" role="group" aria-label="Content type">
        <button type="button" className={"btn " + (tab === "gallery" ? "btn-success" : "btn-outline-success")} onClick={() => setTab("gallery")}>Gallery</button>
        <button type="button" className={"btn " + (tab === "stories" ? "btn-success" : "btn-outline-success")} onClick={() => setTab("stories")}>Success stories</button>
      </div>

      <form className="border rounded-4 p-3 p-md-4 mb-4" onSubmit={save}>
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
          <h3 className="h5 mb-0">{editing ? "Edit content" : "Create a draft"}</h3>
          {editing && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setEditing(null); setForm(tab === "gallery" ? emptyGallery : emptyStory); }}>Cancel edit</button>}
        </div>
        <div className="row g-3">
          <div className="col-md-8"><label className="form-label" htmlFor="content-title">Title</label><input id="content-title" className="form-control" maxLength={180} required value={form.title} onChange={e => update("title", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label" htmlFor="content-category">Category</label><input id="content-category" className="form-control" maxLength={80} value={form.category} onChange={e => update("category", e.target.value)} /></div>
          {tab === "gallery" ? <>
            <div className="col-md-8"><label className="form-label" htmlFor="media-url">Media URL (HTTPS or same-site path)</label><input id="media-url" className={"form-control " + (form.mediaUrl ? (galleryUrlValid ? "is-valid" : "is-invalid") : "")} type="url" inputMode="url" autoComplete="url" placeholder="https://… or /images/photo.jpg" value={form.mediaUrl} onChange={e => update("mediaUrl", e.target.value)} required /><div className="form-text">Paste a direct image/video link or a same-site path. Only HTTPS links are accepted.</div>{form.mediaUrl && !galleryUrlValid && <div className="invalid-feedback d-block">Use a valid HTTPS URL or a path beginning with / (not //).</div>}</div>
            <div className="col-md-4"><label className="form-label" htmlFor="media-type">Media type</label><select id="media-type" className="form-select" value={form.mediaType} onChange={e => update("mediaType", e.target.value)}><option value="image">Image</option><option value="video">Video</option></select></div>
            <div className="col-12"><label className="form-label" htmlFor="media-alt">Alternative text</label><input id="media-alt" className="form-control" maxLength={300} required value={form.altText} onChange={e => update("altText", e.target.value)} /><div className="form-text">Describe the meaningful content of the image for visitors using screen readers.</div></div>
            <div className="col-12"><label className="form-label" htmlFor="media-caption">Caption</label><textarea id="media-caption" className="form-control" rows="2" maxLength={700} value={form.caption} onChange={e => update("caption", e.target.value)} /></div>\n            {form.mediaType === "image" && galleryUrlValid && <div className="col-12"><div className="border rounded-3 p-2"><p className="small fw-semibold mb-2">Image preview</p><img src={form.mediaUrl.trim()} alt={form.altText || "Gallery preview"} className="img-fluid rounded" style={{ maxHeight: "320px", objectFit: "contain" }} onError={e => { e.currentTarget.dataset.failed = "true"; e.currentTarget.alt = "Image preview unavailable — verify the URL and permissions."; e.currentTarget.style.display = "none"; }} onLoad={e => { e.currentTarget.dataset.failed = "false"; e.currentTarget.style.display = "block"; }} /><span className="small text-secondary" aria-live="polite">If the preview does not load, verify the link is publicly accessible and points directly to the media.</span></div></div>}
            <div className="col-md-8"><label className="form-label" htmlFor="media-location">Public location label</label><input id="media-location" className="form-control" maxLength={160} value={form.locationLabel} onChange={e => update("locationLabel", e.target.value)} /></div>
          </> : <>
            <div className="col-12"><label className="form-label" htmlFor="story-excerpt">Public summary</label><textarea id="story-excerpt" className="form-control" rows="2" maxLength={700} required value={form.excerpt} onChange={e => update("excerpt", e.target.value)} /></div>
            <div className="col-12"><label className="form-label" htmlFor="story-body">Story</label><textarea id="story-body" className="form-control" rows="6" maxLength={10000} required value={form.body} onChange={e => update("body", e.target.value)} /></div>
            <div className="col-md-8"><label className="form-label" htmlFor="story-image">Image URL (optional)</label><input id="story-image" className="form-control" value={form.imageUrl} onChange={e => update("imageUrl", e.target.value)} /></div>
            <div className="col-md-4"><label className="form-label" htmlFor="story-alt">Image alt text</label><input id="story-alt" className="form-control" maxLength={300} value={form.imageAlt} onChange={e => update("imageAlt", e.target.value)} /></div>
            <div className="col-12"><label className="form-label" htmlFor="story-attribution">Public attribution (optional)</label><input id="story-attribution" className="form-control" maxLength={160} value={form.attribution} onChange={e => update("attribution", e.target.value)} /></div>
          </>}
          <div className="col-md-4"><label className="form-label" htmlFor="content-order">Display order</label><input id="content-order" type="number" min="0" max="100000" className="form-control" value={form.displayOrder} onChange={e => update("displayOrder", e.target.value)} /></div>
          <div className="col-12">
            <div className="form-check mb-2"><input id="content-consent" type="checkbox" className="form-check-input" checked={form.consentVerified} onChange={e => update("consentVerified", e.target.checked)} /><label className="form-check-label" htmlFor="content-consent">Documented consent and safeguarding review have been verified.</label></div>
            <div className="form-check"><input id="content-publish" type="checkbox" className="form-check-input" checked={form.isPublished} disabled={!form.consentVerified} onChange={e => update("isPublished", e.target.checked)} /><label className="form-check-label" htmlFor="content-publish">Publish publicly (requires verified consent).</label></div><div className="form-text">Keep this unchecked until consent and safeguarding review are documented. Removing consent automatically unchecks publication.</div>
          </div>
          <div className="col-12 d-flex flex-wrap gap-2"><button type="submit" className="btn btn-success" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Save draft"}</button></div>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
        <h3 className="h5 mb-0">{tab === "gallery" ? "Gallery items" : "Success stories"}</h3>
        <button type="button" className="btn btn-sm btn-outline-success" onClick={load} disabled={loading}><i className="bi bi-arrow-clockwise me-1" />Refresh</button>
      </div>
      {loading ? <p className="text-secondary" role="status">Loading content…</p> : items.length ? (
        <div className="row g-3">
          {items.map(item => <div className="col-12 col-lg-6" key={item.id}>
            <article className="border rounded-4 p-3 h-100">\n              {tab === "gallery" && item.media_type === "image" && item.media_url && <img src={item.media_url} alt={item.alt_text || "Gallery item preview"} className="img-fluid rounded mb-3" loading="lazy" style={{ width: "100%", maxHeight: "220px", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div><h4 className="h6 mb-1">{item.title}</h4><p className="small text-secondary mb-2">{item.category}</p></div>
                <span className={"badge " + (item.is_published ? "text-bg-success" : "text-bg-secondary")}>{item.is_published ? "Published" : "Draft"}</span>
              </div>
              <p className="small text-secondary mb-2">{tab === "gallery" ? item.caption : item.excerpt}</p>
              <div className="small mb-3 d-flex flex-wrap gap-2"><span className={"badge " + (item.consent_verified ? "text-bg-success" : "text-bg-warning")}>Consent: {item.consent_verified ? "Verified" : "Not verified"}</span><span className="badge text-bg-light border text-dark">Order: {item.display_order ?? 0}</span>{tab === "gallery" && <span className="badge text-bg-light border text-dark">{item.media_type || "media"}</span>}</div>
              <div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-sm btn-outline-success" onClick={() => edit(item)}>Edit</button><button type="button" className="btn btn-sm btn-outline-danger" disabled={busy} onClick={() => remove(item)} aria-label={`Delete ${item.title}`}>Delete</button></div>
            </article>
          </div>)}
        </div>
      ) : <p className="text-secondary">No content items yet. Create a draft above.</p>}
    </section>
  );
}
