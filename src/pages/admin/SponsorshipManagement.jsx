import React, { useCallback, useEffect, useState } from "react";
import { API_ORIGIN } from "../../services/api-config.js";

const API = path => API_ORIGIN + path;
async function csrf() {
  let r; try { r = await fetch(API("/auth/csrf"), { credentials: "include", cache: "no-store" }); }
  catch { throw new Error("Your staff session could not be reached. Check your connection and sign in again."); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.csrfToken) throw new Error(d.error || "Your staff session has expired. Please sign in again.");
  return d.csrfToken;
}
async function call(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) };
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers["X-CSRF-Token"] = await csrf();
  let r; try { r = await fetch(API(path), { ...options, method, headers, credentials: "include", cache: "no-store" }); }
  catch { throw new Error("We could not reach the sponsorship service. Check your connection and try again."); }
  const type = r.headers.get("content-type") || "", d = type.toLowerCase().includes("application/json") ? await r.json().catch(() => ({})) : {};
  if (!r.ok) {
    const messages = { 400: "Some sponsorship information is missing or invalid. Review the form and try again.", 401: "Your staff session has expired. Please sign in again.", 403: "You do not have permission to complete this sponsorship action.", 404: "The requested sponsorship record could not be found. Refresh and try again.", 409: "This sponsorship record has changed. Refresh before retrying.", 422: "Please review the information entered and correct invalid fields.", 429: "Too many requests. Please wait and try again." };
    throw new Error(d.error || d.message || messages[r.status] || (r.status >= 500 ? "The sponsorship service is temporarily unavailable. Please try again shortly." : "The request could not be completed. Please try again."));
  }
  if (r.status !== 204 && !type.toLowerCase().includes("application/json")) throw new Error("The sponsorship service returned an unexpected response. Please try again later.");
  return d;
}
const date = v => v ? new Date(v).toLocaleDateString() : "—";
const money = (v,c) => new Intl.NumberFormat("en-UG",{style:"currency",currency:c||"UGX",maximumFractionDigits:c==="UGX"?0:2}).format(Number(v||0));
const title = v => String(v||"").replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());

export default function SponsorshipManagement({ canViewPrivate = false }) {
  const [tab,setTab] = useState("matches");
  const [matches,setMatches] = useState([]);
  const [interests,setInterests] = useState([]);
  const [profiles,setProfiles] = useState([]);
  const [donors,setDonors] = useState([]);
  const [reports,setReports] = useState([]);
  const [selected,setSelected] = useState(null);
  const [caseData,setCaseData] = useState(null);
  const [form,setForm] = useState({childProfileId:"",donorId:"",sponsorshipModel:"individual",contributionFrequency:"monthly",expectedAmount:"",currency:"UGX",startDate:"",staffNote:"",interestId:""});
  const [attendance,setAttendance] = useState({schoolName:"",academicYear:String(new Date().getFullYear()),term:"Term 1",classLevel:"",attendanceDate:"",attendanceStatus:"present",teacherFeedback:""});
  const [report,setReport] = useState({periodStart:"",periodEnd:"",schoolName:"",classLevel:"",academicSummary:"",attendanceSummary:"",strengths:"",supportNeeds:"",welfareUpdate:"",nextSteps:"",internalNotes:""});
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [m,i,p,d,q] = await Promise.all([
        call("/admin/api/sponsorship-management/matches"),
        call("/admin/api/sponsorship-management/interests"),
        call("/admin/api/sponsorship-profiles"),
        call("/admin/api/donors?limit=250"),
        call("/admin/api/sponsorship-management/reports/queue")
      ]);
      setMatches(m.matches||[]); setInterests(i.interests||[]);
      setProfiles(p.profiles||[]); setDonors(d.donors||[]); setReports(q.reports||[]);
    } catch(e) { setError(e.message); }
  },[]);
  useEffect(()=>{load();},[load]);

  async function createMatch(e) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      await call("/admin/api/sponsorship-management/matches",{method:"POST",body:JSON.stringify(form)});
      setForm({...form,donorId:"",expectedAmount:"",staffNote:"",interestId:""});
      setNotice("Sponsorship assignment created as pending. Activate it after approval.");
      await load();
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function changeMatch(match,status) {
    setBusy(true); setError(""); setNotice("");
    try { await call("/admin/api/sponsorship-management/matches/"+match.id,{method:"PATCH",body:JSON.stringify({status})}); setNotice("Sponsorship status updated."); await load(); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function reviewInterest(item,status) {
    setBusy(true); setError("");
    try { await call("/admin/api/sponsorship-management/interests/"+item.id,{method:"PATCH",body:JSON.stringify({status})}); setNotice("Sponsorship request reviewed."); await load(); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function openCase(profile) {
    setSelected(profile); setCaseData(null); setError("");
    try { const result=await call("/admin/api/sponsorship-management/children/"+profile.id+"/case"); setCaseData(result); }
    catch(e) { setError(e.message); }
  }
  async function saveAttendance(e) {
    e.preventDefault(); if(!selected) return; setBusy(true); setError("");
    try { await call("/admin/api/sponsorship-management/children/"+selected.id+"/attendance",{method:"POST",body:JSON.stringify(attendance)}); setNotice("Attendance record saved."); const result=await call("/admin/api/sponsorship-management/children/"+selected.id+"/case"); setCaseData(result); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function saveReport(e) {
    e.preventDefault(); if(!selected) return; setBusy(true); setError("");
    try {
      const result=await call("/admin/api/sponsorship-management/children/"+selected.id+"/reports",{method:"POST",body:JSON.stringify(report)});
      await call("/admin/api/sponsorship-management/reports/"+result.report.id+"/submit",{method:"POST",body:JSON.stringify({})});
      setNotice("Quarterly report submitted for independent review."); setReport({periodStart:"",periodEnd:"",schoolName:"",classLevel:"",academicSummary:"",attendanceSummary:"",strengths:"",supportNeeds:"",welfareUpdate:"",nextSteps:"",internalNotes:""});
      const fresh=await call("/admin/api/sponsorship-management/children/"+selected.id+"/case"); setCaseData(fresh); await load();
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function reviewReport(item,decision) {
    const note=window.prompt("Review note (optional):") || "";
    setBusy(true); setError("");
    try { await call("/admin/api/sponsorship-management/reports/"+item.id+"/review",{method:"POST",body:JSON.stringify({decision,note})}); setNotice("Report "+decision+"."); await load(); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }

  return <div className="gom-sponsorship">
    <div className="gom-sponsorship-intro"><div><span className="small text-success fw-bold text-uppercase">Child wellbeing and education</span><h2>Child sponsorship management</h2><p>Manage sponsor requests, assignments, contributions and quarterly child progress.</p></div><button className="btn btn-outline-success" onClick={load}><i className="bi bi-arrow-clockwise me-1"/>Refresh</button></div>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {notice && <div className="alert alert-success" role="status">{notice}</div>}
    <div className="gom-sponsorship-stats row g-3 mb-3">
      <div className="col-6 col-xl-3"><div><small>Assignments</small><strong>{matches.length}</strong></div></div>
      <div className="col-6 col-xl-3"><div><small>Active</small><strong>{matches.filter(x=>x.status==="active").length}</strong></div></div>
      <div className="col-6 col-xl-3"><div><small>Open requests</small><strong>{interests.filter(x=>["submitted","under_review"].includes(x.status)).length}</strong></div></div>
      <div className="col-6 col-xl-3"><div><small>Reports to review</small><strong>{reports.length}</strong></div></div>
    </div>
    <div className="nav nav-pills gap-2 mb-3 flex-wrap">
      {[["matches","Assignments"],["interests","Sponsor requests"],["reports","Quarterly report review"]].map(([id,label])=><button key={id} className={"nav-link "+(tab===id?"active":"")} onClick={()=>setTab(id)}>{label}</button>)}
    </div>
    {tab==="matches" && <>
      <section className="gom-panel p-3 p-md-4 mb-3">
        <h3 className="h5 fw-bold">Create a sponsorship assignment</h3>
        <p className="small text-secondary">Choose individual or shared sponsorship and monthly or flexible contributions. New assignments start pending.</p>
        <form onSubmit={createMatch} className="row g-3">
          <div className="col-12 col-md-6"><label className="form-label">Child public profile</label><select className="form-select" required value={form.childProfileId} onChange={e=>setForm({...form,childProfileId:e.target.value})}><option value="">Choose a child</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.display_name} · {p.region_label}</option>)}</select></div>
          <div className="col-12 col-md-6"><label className="form-label">Sponsor / donor</label><select className="form-select" required value={form.donorId} onChange={e=>setForm({...form,donorId:e.target.value})}><option value="">Choose donor</option>{donors.map(d=><option key={d.id} value={d.id}>{d.name} {d.email?"· "+d.email:""}</option>)}</select></div>
          <div className="col-6 col-md-3"><label className="form-label">Sponsorship model</label><select className="form-select" value={form.sponsorshipModel} onChange={e=>setForm({...form,sponsorshipModel:e.target.value})}><option value="individual">Individual</option><option value="shared">Shared</option></select></div>
          <div className="col-6 col-md-3"><label className="form-label">Contribution</label><select className="form-select" value={form.contributionFrequency} onChange={e=>setForm({...form,contributionFrequency:e.target.value})}><option value="monthly">Monthly</option><option value="flexible">Flexible</option></select></div>
          <div className="col-6 col-md-2"><label className="form-label">Amount</label><input type="number" min="1" step="0.01" required className="form-control" value={form.expectedAmount} onChange={e=>setForm({...form,expectedAmount:e.target.value})}/></div>
          <div className="col-6 col-md-2"><label className="form-label">Currency</label><select className="form-select" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}><option>UGX</option><option>USD</option></select></div>
          <div className="col-12 col-md-2"><label className="form-label">Start date</label><input type="date" className="form-control" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></div>
          <div className="col-12"><label className="form-label">Internal note</label><input className="form-control" maxLength="2000" value={form.staffNote} onChange={e=>setForm({...form,staffNote:e.target.value})}/></div>
          <div className="col-12"><button className="btn btn-success" disabled={busy}>{busy?"Saving…":"Create pending assignment"}</button></div>
        </form>
      </section>
      <section className="gom-panel p-3 p-md-4"><h3 className="h5 fw-bold">Sponsor assignments</h3>
        {matches.length===0?<p className="text-secondary mb-0">No sponsorship assignments yet.</p>:<div className="table-responsive"><table className="table align-middle"><thead><tr><th>Child</th><th>Sponsor</th><th>Model</th><th>Contribution</th><th>Status</th><th>Actions</th></tr></thead><tbody>{matches.map(m=><tr key={m.id}><td><strong>{m.child_display_name}</strong></td><td>{m.sponsor_name}<small className="d-block text-secondary">{m.sponsor_email}</small></td><td>{title(m.sponsorship_model)}</td><td>{money(m.expected_amount,m.currency)} <small className="d-block text-secondary">{title(m.contribution_frequency)}</small></td><td><span className="badge text-bg-light border">{title(m.status)}</span></td><td className="text-nowrap"><div className="d-flex gap-1 flex-wrap">{m.status==="pending"&&<button className="btn btn-sm btn-success" disabled={busy} onClick={()=>changeMatch(m,"active")}>Activate</button>}{m.status==="active"&&<button className="btn btn-sm btn-outline-warning" disabled={busy} onClick={()=>changeMatch(m,"paused")}>Pause</button>}{m.status==="paused"&&<button className="btn btn-sm btn-outline-success" disabled={busy} onClick={()=>changeMatch(m,"active")}>Resume</button>}{canViewPrivate && <button className="btn btn-sm btn-outline-primary" disabled={busy} onClick={()=>openCase({id:m.child_sponsorship_profile_id,display_name:m.child_display_name})}>Case</button>}{!["completed","withdrawn"].includes(m.status)&&<button className="btn btn-sm btn-outline-secondary" disabled={busy} onClick={()=>changeMatch(m,"completed")}>Complete</button>}</div></td></tr>)}</tbody></table></div>}
      </section>
    </>}
    {tab==="interests" && <section className="gom-panel p-3 p-md-4"><h3 className="h5 fw-bold">Sponsor requests</h3>{interests.length===0?<p className="text-secondary mb-0">No sponsor requests have been submitted.</p>:<div className="table-responsive"><table className="table align-middle"><thead><tr><th>Sponsor</th><th>Child preference</th><th>Model</th><th>Contribution</th><th>Status</th><th>Review</th></tr></thead><tbody>{interests.map(i=><tr key={i.id}><td>{i.sponsor_name}<small className="d-block text-secondary">{i.sponsor_email}</small></td><td>{i.child_display_name||"Open to recommendation"}</td><td>{title(i.sponsorship_model)}</td><td>{i.proposed_amount?money(i.proposed_amount,i.currency):"Discuss"}<small className="d-block text-secondary">{title(i.contribution_frequency)}</small></td><td>{title(i.status)}</td><td className="text-nowrap">{["submitted","under_review"].includes(i.status)&&<><button className="btn btn-sm btn-outline-success me-1" disabled={busy} onClick={()=>reviewInterest(i,"under_review")}>Review</button><button className="btn btn-sm btn-outline-primary me-1" disabled={busy} onClick={()=>reviewInterest(i,"accepted")}>Accept</button><button className="btn btn-sm btn-outline-danger me-1" disabled={busy} onClick={()=>reviewInterest(i,"declined")}>Decline</button></>}{i.status==="accepted" && <button className="btn btn-sm btn-success" onClick={()=>{setForm({...form,interestId:i.id,donorId:i.donor_id||"",childProfileId:i.child_sponsorship_profile_id||"",sponsorshipModel:i.sponsorship_model,contributionFrequency:i.contribution_frequency,expectedAmount:i.proposed_amount||"",currency:i.currency||"UGX"});setTab("matches");}}>Create assignment</button>}</td></tr>)}</tbody></table></div>}</section>}
    {tab==="reports" && <section className="gom-panel p-3 p-md-4"><h3 className="h5 fw-bold">Quarterly reports awaiting review</h3><p className="small text-secondary">Only approved reports become visible in the sponsor portal.</p>{reports.length===0?<p className="text-secondary mb-0">No reports are awaiting review.</p>:<div className="table-responsive"><table className="table align-middle"><thead><tr><th>Child</th><th>Period</th><th>School</th><th>Summary</th><th>Decision</th></tr></thead><tbody>{reports.map(r=><tr key={r.id}><td>{r.display_name||r.beneficiary_code}</td><td>{date(r.period_start)} – {date(r.period_end)}</td><td>{r.school_name||"—"}</td><td>{r.academic_summary}</td><td className="text-nowrap"><button className="btn btn-sm btn-success me-1" disabled={busy} onClick={()=>reviewReport(r,"approved")}>Approve</button><button className="btn btn-sm btn-outline-danger" disabled={busy} onClick={()=>reviewReport(r,"rejected")}>Reject</button></td></tr>)}</tbody></table></div>}</section>}
    {selected && <section className="gom-panel p-3 p-md-4 mt-3">
      <div className="d-flex justify-content-between align-items-start"><div><span className="small text-success fw-bold text-uppercase">Restricted case workspace</span><h3 className="h5 fw-bold">{caseData?.child?.beneficiary_code||selected.display_name}</h3></div><button className="btn btn-sm btn-outline-secondary" onClick={()=>{setSelected(null);setCaseData(null);}}>Close case</button></div>
      {!canViewPrivate?<p className="text-secondary">Your account can manage public sponsorship profiles but does not have private case access.</p>:!caseData?<p className="text-secondary">Loading restricted case record…</p>:<>
        <div className="row g-3 mb-3"><div className="col-md-4"><small className="text-secondary">Legal name</small><strong className="d-block">{caseData.child.first_name} {caseData.child.last_name}</strong></div><div className="col-md-4"><small className="text-secondary">Caregiver</small><strong className="d-block">{caseData.child.primary_caregiver_name||"—"}</strong></div><div className="col-md-4"><small className="text-secondary">Consent</small><strong className="d-block">{title(caseData.child.consent_status)}</strong></div></div>
        <div className="row g-3">
          <div className="col-lg-6"><form className="border rounded-3 p-3" onSubmit={saveAttendance}><h4 className="h6 fw-bold">Record school attendance</h4>{[["School name","schoolName"],["Academic year","academicYear"],["Class","classLevel"]].map(([l,k])=><div className="mb-2" key={k}><label className="form-label small">{l}</label><input className="form-control" required={k!=="classLevel"} value={attendance[k]} onChange={e=>setAttendance({...attendance,[k]:e.target.value})}/></div>)}<div className="row g-2"><div className="col-6"><label className="form-label small">Term</label><select className="form-select" value={attendance.term} onChange={e=>setAttendance({...attendance,term:e.target.value})}><option>Term 1</option><option>Term 2</option><option>Term 3</option></select></div><div className="col-6"><label className="form-label small">Date</label><input type="date" required className="form-control" value={attendance.attendanceDate} onChange={e=>setAttendance({...attendance,attendanceDate:e.target.value})}/></div></div><div className="mt-2"><label className="form-label small">Attendance</label><select className="form-select" value={attendance.attendanceStatus} onChange={e=>setAttendance({...attendance,attendanceStatus:e.target.value})}><option value="present">Present</option><option value="absent">Absent</option><option value="excused">Excused</option></select></div><div className="mt-2"><label className="form-label small">Teacher feedback</label><textarea className="form-control" rows="2" value={attendance.teacherFeedback} onChange={e=>setAttendance({...attendance,teacherFeedback:e.target.value})}/></div><button className="btn btn-success btn-sm mt-3" disabled={busy}>Save attendance</button></form></div>
          <div className="col-lg-6"><form className="border rounded-3 p-3" onSubmit={saveReport}><h4 className="h6 fw-bold">Prepare quarterly report</h4><div className="row g-2"><div className="col-6"><label className="form-label small">Period start</label><input type="date" required className="form-control" value={report.periodStart} onChange={e=>setReport({...report,periodStart:e.target.value})}/></div><div className="col-6"><label className="form-label small">Period end</label><input type="date" required className="form-control" value={report.periodEnd} onChange={e=>setReport({...report,periodEnd:e.target.value})}/></div></div>{[["School","schoolName"],["Class","classLevel"],["Academic summary","academicSummary"],["Attendance summary","attendanceSummary"],["Strengths","strengths"],["Support needs","supportNeeds"],["Welfare update","welfareUpdate"],["Next steps","nextSteps"],["Internal case notes (not shared)","internalNotes"]].map(([l,k])=><div className="mt-2" key={k}><label className="form-label small">{l}</label>{["academicSummary","attendanceSummary","strengths","supportNeeds","welfareUpdate","nextSteps","internalNotes"].includes(k)?<textarea className="form-control" rows={k==="academicSummary"?3:2} required={k==="academicSummary"} value={report[k]} onChange={e=>setReport({...report,[k]:e.target.value})}/>:<input className="form-control" value={report[k]} onChange={e=>setReport({...report,[k]:e.target.value})}/>}</div>)}<button className="btn btn-success btn-sm mt-3" disabled={busy}>Submit for review</button></form></div>
        </div>
        <div className="mt-4"><h4 className="h6 fw-bold">Attendance records</h4>{caseData.attendance?.length?<div className="table-responsive"><table className="table table-sm"><thead><tr><th>Date</th><th>School</th><th>Term</th><th>Status</th></tr></thead><tbody>{caseData.attendance.map(a=><tr key={a.id}><td>{date(a.attendance_date)}</td><td>{a.school_name}</td><td>{a.term}</td><td>{title(a.attendance_status)}</td></tr>)}</tbody></table></div>:<p className="small text-secondary">No attendance entries yet.</p>}</div>
      </>}
    </section>}
  </div>;
}
