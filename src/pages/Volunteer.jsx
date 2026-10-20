import React, { useState } from "react";
import { AppLink } from "../components/SiteChrome.jsx";

const interests = [
  "Community outreach",
  "Child welfare and support",
  "Education support",
  "Nutrition and wellbeing",
  "Skills and mentorship",
  "Fundraising and events",
  "Administration and communications",
  "Other",
];

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const body = await response.text();
    if (body.trimStart().startsWith("<!doctype") || body.trimStart().startsWith("<html")) {
      throw new Error(
        "The volunteer API returned a webpage instead of JSON. Please check that the backend has a POST /api/volunteer route and that the frontend API URL is configured correctly."
      );
    }
    throw new Error("The server returned an unexpected response. Please try again later.");
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Your application could not be submitted. Please try again.");
  }
  return data;
}

export default function Volunteer({ navigate }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "",
    availability: "",
    experience: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setSubmitting(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          interest: form.interest,
          availability: form.availability,
          experience: form.experience.trim(),
          message: form.message.trim(),
          consent: form.consent,
        }),
      });
      const data = await readResponse(response);
      setStatus({ type: "success", message: data?.message || "Thank you for volunteering! Your interest has been submitted." });
      setForm({ fullName: "", email: "", phone: "", interest: "", availability: "", experience: "", message: "", consent: false });
    } catch (error) {
      setStatus({ type: "error", message: error?.message || "We could not submit your application. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="volunteer-page">
      <section className="volunteer-hero" style={{ background: "linear-gradient(120deg, rgba(16,37,27,.96), rgba(25,135,84,.86)), url('/images/gallery/volunteers-01.jpg') center/cover" }}>
        <div className="container py-5 py-lg-6">
          <span className="volunteer-eyebrow">GARDEN OF MERCY FOUNDATION</span>
          <h1>Give Your Time. <span>Grow Hope.</span></h1>
          <p>Small acts of service can make a lasting difference. Join us in supporting children, strengthening families, and serving communities with dignity and compassion.</p>
          <a className="button button-gold" href="#volunteer-form">Become a Volunteer <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="container volunteer-content py-5 py-lg-6">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <span className="volunteer-kicker">MAKE A DIFFERENCE</span>
            <h2>There is a place for your gifts.</h2>
            <p className="volunteer-lead">Whether you can offer a few hours, professional skills, or a helping hand at community activities, your contribution can help turn compassion into practical action.</p>
            <div className="volunteer-benefit"><span className="volunteer-icon"><i className="bi bi-people-fill" /></span><div><h3>Serve your community</h3><p>Support community activities and initiatives that respond to local needs.</p></div></div>
            <div className="volunteer-benefit"><span className="volunteer-icon"><i className="bi bi-book-half" /></span><div><h3>Share your skills</h3><p>Contribute your experience in education, mentorship, administration, communications, or other areas.</p></div></div>
            <div className="volunteer-benefit"><span className="volunteer-icon"><i className="bi bi-heart-fill" /></span><div><h3>Lead with compassion</h3><p>Help promote dignity, safeguarding, and respectful support for children and families.</p></div></div>
            <div className="volunteer-note"><strong>Our commitment</strong><p>We aim to treat every volunteer and every community member with respect. Volunteer opportunities depend on current needs, suitability, and any required safeguarding checks.</p></div>
            <p className="mt-4 mb-0">Have a question first? <AppLink to="/contact" navigate={navigate}>Contact our team</AppLink>.</p>
          </div>

          <div className="col-lg-7" id="volunteer-form">
            <div className="volunteer-form-card">
              <div className="mb-4"><span className="volunteer-kicker">VOLUNTEER APPLICATION</span><h2>Tell us about yourself</h2><p>Complete the form below and our team can follow up about suitable opportunities.</p></div>
              {status.message && <div className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`} role="status">{status.message}</div>}
              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-md-6"><label className="form-label" htmlFor="vol-fullName">Full name *</label><input className="form-control" id="vol-fullName" name="fullName" autoComplete="name" value={form.fullName} onChange={update} required maxLength={120} /></div>
                  <div className="col-md-6"><label className="form-label" htmlFor="vol-email">Email address *</label><input className="form-control" id="vol-email" name="email" type="email" autoComplete="email" value={form.email} onChange={update} required maxLength={254} /></div>
                  <div className="col-md-6"><label className="form-label" htmlFor="vol-phone">Phone number</label><input className="form-control" id="vol-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} maxLength={40} /></div>
                  <div className="col-md-6"><label className="form-label" htmlFor="vol-interest">Area of interest *</label><select className="form-select" id="vol-interest" name="interest" value={form.interest} onChange={update} required><option value="">Choose an area</option>{interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}</select></div>
                  <div className="col-12"><label className="form-label" htmlFor="vol-availability">When are you available?</label><select className="form-select" id="vol-availability" name="availability" value={form.availability} onChange={update}><option value="">Select availability (optional)</option><option>Weekdays</option><option>Weekends</option><option>Some evenings</option><option>Occasional events</option><option>Flexible / to be discussed</option></select></div>
                  <div className="col-12"><label className="form-label" htmlFor="vol-experience">Relevant experience or skills</label><textarea className="form-control" id="vol-experience" name="experience" rows="3" value={form.experience} onChange={update} maxLength={2000} placeholder="Tell us about skills, experience, or interests you would like to contribute." /></div>
                  <div className="col-12"><label className="form-label" htmlFor="vol-message">Anything else you would like us to know?</label><textarea className="form-control" id="vol-message" name="message" rows="3" value={form.message} onChange={update} maxLength={2000} placeholder="Share any questions or details that may help us follow up." /></div>
                  <div className="col-12"><div className="form-check"><input className="form-check-input" type="checkbox" id="vol-consent" name="consent" checked={form.consent} onChange={update} required /><label className="form-check-label" htmlFor="vol-consent">I agree that Garden of Mercy Foundation may use these details to contact me about volunteering. *</label></div></div>
                  <div className="col-12 pt-2"><button className="button button-green volunteer-submit" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit volunteer interest"} <span aria-hidden="true">→</span></button><p className="volunteer-privacy">Please do not include sensitive personal information in this form.</p></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .volunteer-page { color: var(--gomf-dark, #10251b); }
        .volunteer-hero { color:#fff; padding: 3rem 0; }
        .volunteer-hero .container { max-width: 1140px; }
        .volunteer-eyebrow,.volunteer-kicker { display:inline-block; font-size:.76rem; font-weight:800; letter-spacing:.13em; margin-bottom:1rem; }
        .volunteer-eyebrow { color:#ffda62; }
        .volunteer-kicker { color:var(--gomf-green, #198754); }
        .volunteer-hero h1 { max-width:760px; font-size:clamp(2.5rem, 5vw, 4.5rem); line-height:1.05; font-weight:800; letter-spacing:-.04em; margin:0 0 1.25rem; }
        .volunteer-hero h1 span { color:#ffda62; }
        .volunteer-hero p { max-width:690px; color:rgba(255,255,255,.88); font-size:1.12rem; line-height:1.8; margin-bottom:1.8rem; }
        .volunteer-content { max-width:1140px; }
        .volunteer-content h2,.volunteer-form-card h2 { font-weight:800; letter-spacing:-.025em; font-size:clamp(1.8rem, 3vw, 2.5rem); margin-bottom:1rem; }
        .volunteer-lead,.volunteer-form-card > div p { color:var(--gomf-muted,#6c757d); line-height:1.8; }
        .volunteer-benefit { display:flex; gap:1rem; margin-top:1.7rem; align-items:flex-start; }
        .volunteer-icon { flex:0 0 48px; height:48px; border-radius:14px; display:grid; place-items:center; background:#eaf5ef; color:var(--gomf-green,#198754); font-size:1.2rem; }
        .volunteer-benefit h3 { font-size:1.05rem; font-weight:750; margin:.1rem 0 .35rem; }
        .volunteer-benefit p { color:var(--gomf-muted,#6c757d); line-height:1.65; margin:0; }
        .volunteer-note { background:#f4f8f5; border-left:4px solid var(--gomf-green,#198754); border-radius:0 12px 12px 0; padding:1.1rem 1.25rem; margin-top:2rem; }
        .volunteer-note p { color:#53635a; margin:.4rem 0 0; line-height:1.7; }
        .volunteer-form-card { padding:clamp(1.25rem, 3vw, 2.25rem); border:1px solid var(--gomf-border,#dee2e6); border-radius:20px; background:#fff; box-shadow:0 1rem 3rem rgba(16,37,27,.07); }
        .volunteer-form-card .form-label { font-weight:650; font-size:.92rem; }
        .volunteer-form-card .form-control,.volunteer-form-card .form-select { min-height:48px; border-radius:10px; border-color:#d7e0da; }
        .volunteer-form-card textarea.form-control { min-height:unset; }
        .volunteer-form-card .form-control:focus,.volunteer-form-card .form-select:focus { border-color:var(--gomf-green,#198754); box-shadow:0 0 0 .2rem rgba(25,135,84,.12); }
        .button-green { background:var(--gomf-green,#198754); color:#fff; border:0; }
        .button-green:hover { color:#fff; filter:brightness(.94); }
        .volunteer-submit { width:100%; justify-content:center; display:flex; gap:.65rem; align-items:center; }
        .volunteer-submit:disabled { opacity:.65; cursor:wait; }
        .volunteer-privacy { color:var(--gomf-muted,#6c757d); font-size:.8rem; text-align:center; margin:.85rem 0 0; }
        @media (min-width: 992px) { .py-lg-6 { padding-top:5rem!important; padding-bottom:5rem!important; } }
      `}</style>
    </div>
  );
}
