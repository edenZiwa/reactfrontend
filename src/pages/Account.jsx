import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { API_BASE, API_ORIGIN } from "../services/api-config.js";
import AccountAuthPanel from "../components/AccountAuthPanel.jsx";
import "../css/account.css";
import SponsorPortal from "./SponsorPortal.jsx";
import VolunteerPortal from "./VolunteerPortal.jsx";
import MemberProfile from "../components/MemberProfile.jsx";


async function getAccountCsrfToken(currentToken = "") {
    if (currentToken) return currentToken;
    let response;
    try { response = await fetch(`${API_ORIGIN}/auth/csrf`, { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } }); }
    catch { throw new Error("We could not reach the secure session service. Check your connection and try again."); }
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.csrfToken) throw new Error(data.message || data.error || "Your secure session could not be verified. Please sign in again.");
    return data.csrfToken;
}

const SKILLS = [
    "Teaching",
    "Counselling",
    "Healthcare",
    "Administration",
    "Fundraising",
    "Community outreach",
    "Communications",
    "Logistics",
    "IT and digital",
    "Event support",
    "Other",
];

const TABS = [
    { id: "overview", label: "Overview", icon: "bi-grid-1x2" },
    { id: "profile", label: "Personal profile", icon: "bi-person-vcard" },
    { id: "volunteer", label: "Volunteer profile", icon: "bi-heart" },
    { id: "programs", label: "Programs", icon: "bi-collection" },
    { id: "applications", label: "Applications", icon: "bi-file-earmark-text" },
    { id: "donations", label: "Giving history", icon: "bi-gift" },
    { id: "sponsorship", label: "Child sponsorship", icon: "bi-people" },
    { id: "volunteerService", label: "Volunteer service", icon: "bi-hand-thumbs-up" },
];

function Account( {
    navigate
}) {
    const { login, user, status: authStatus, authError, refreshSession } = useAuth();
    const [loading,
        setLoading] = useState(true);
    const [retryKey, setRetryKey] = useState(0);
    const [submittingApplication, setSubmittingApplication] = useState(false);
    const [donationsLoadError, setDonationsLoadError] = useState(false);
    const [needsSignIn, setNeedsSignIn] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const [csrfToken, setCsrfToken] = useState("");
    const [account,
        setAccount] = useState(null);
    const [error,
        setError] = useState("");
    const [activeTab,
        setActiveTab] = useState("overview");
    const [savingProfile,
        setSavingProfile] = useState(false);
    const [profileMessage,
        setProfileMessage] = useState({ text: "", tone: "success" });
    const [applicationMessage,
        setApplicationMessage] = useState({ text: "", tone: "success" });
    const [selectedSkills,
        setSelectedSkills] = useState([]);
    const [volunteer,
        setVolunteer] = useState( {
            phone: "",
            location: "",
            availability: "",
            interests: "",
            motivation: "",
        });
    const [application,
        setApplication] = useState( {
            type: "volunteer",
            title: "",
            message: "",
        });

    const [programs,
        setPrograms] = useState([]);
    const [registrations,
        setRegistrations] = useState([]);
    const [applications,
        setApplications] = useState([]);
    const [donations,
        setDonations] = useState([]);

    const staffRoles = ["super_admin", "admin", "staff", "finance", "programs", "volunteers", "communications"];
    const hasPublicRole = Array.isArray(user?.roles) && user.roles.includes("public_user");
    const hasStaffRole = Array.isArray(user?.roles) && user.roles.some((role) => staffRoles.includes(role));

    useEffect(() => {
        if (authStatus === "loading") return undefined;

        if (authStatus === "unavailable") {
            setNeedsSignIn(false);
            setError(authError || "The sign-in service is temporarily unavailable. Your account has not been signed out. Please try again.");
            setLoading(false);
            return undefined;
        }

        if (authStatus === "anonymous") {
            setAccount(null);
            setNeedsSignIn(!authError);
            setError(authError || "");
            setLoading(false);
            return undefined;
        }

        if (!hasPublicRole) {
            setAccount(null);
            setNeedsSignIn(false);
            setError("");
            setLoading(false);
            return undefined;
        }

        let cancelled = false;

        async function loadAccount() {
            try {
                let response;
                try {
                    response = await fetch(`${API_BASE}/account/overview`, {
                        credentials: "include",
                        cache: "no-store",
                        headers: { Accept: "application/json" },
                    });
                } catch {
                    throw new Error("We could not connect to your account. Check your internet connection and try again.");
                }

                if (response.status === 401) {
                    const currentUser = await refreshSession();
                    if (!cancelled) {
                        if (!currentUser) {
                            setNeedsSignIn(true);
                            setAccount(null);
                            setCsrfToken("");
                        } else {
                            throw new Error("Your account service rejected the current session. Please refresh and try again.");
                        }
                    }
                    return;
                }

                if (!response.ok) {
                    const payload = await response.json().catch(() => ({}));
                    const messages = {
                        403: "Your account does not have permission to view this information.",
                        404: "Your account information could not be found. Please contact the foundation.",
                        429: "Too many requests. Please wait a moment and refresh.",
                    };
                    throw new Error(payload.message || payload.error || messages[response.status] || (response.status >= 500
                        ? "The account service is temporarily unavailable. Please try again shortly."
                        : "We could not load your account. Please refresh and try again."));
                }

                const data = await response.json();

                if (cancelled) return;

                setAccount(data?.user ?? user ?? null);
                setCsrfToken(data?.csrfToken || "");
                const profile = data?.profile ?? data?.volunteerProfile ?? {};

                setVolunteer({
                    phone: profile.phone ?? "",
                    location: profile.location ?? "",
                    availability: profile.availability ?? "",
                    interests: Array.isArray(profile.interests) ? profile.interests.join(", ") : (profile.interests ?? ""),
                    motivation: profile.motivation ?? "",
                });

                setSelectedSkills(Array.isArray(profile.skills) ? profile.skills : []);
                setPrograms(Array.isArray(data?.programs) ? data.programs : []);
                setRegistrations(Array.isArray(data?.registrations) ? data.registrations : []);
                setApplications(Array.isArray(data?.applications) ? data.applications : []);
                setDonations(Array.isArray(data?.donations) ? data.donations : []);
                setDonationsLoadError(!Array.isArray(data?.donations));
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Something went wrong.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAccount();

        return () => {
            cancelled = true;
        };
    },
        [retryKey, authStatus, hasPublicRole, authError, user]);

    async function reconcileExpiredSession() {
        try {
            const currentUser = await refreshSession();
            if (!currentUser) {
                setNeedsSignIn(true);
                setAccount(null);
                setCsrfToken("");
            }
        } catch (sessionError) {
            setError(sessionError.message || "We could not verify your session. Please sign in again.");
        }
    }

    async function handleGoogleSignIn() {
        setSigningIn(true);
        setError("");
        try {
            const signedInUser = await login();
            if (!signedInUser) return; // Redirect sign-in is still in progress.
            setNeedsSignIn(false);
            setLoading(true);
            setRetryKey((value) => value + 1);
        } catch (err) {
            setError(err.message || "Google sign-in failed. Please try again.");
        } finally {
            setSigningIn(false);
        }
    }

    function updateVolunteer(event) {
        const {
            name, value
        } = event.target;
        setVolunteer((previous) => ({
            ...previous, [name]: value
        }));
    }

    function toggleSkill(skill) {
        setSelectedSkills((previous) =>
            previous.includes(skill)
            ? previous.filter((item) => item !== skill): [...previous,
                skill]
        );
    }

    async function handleProfileSubmit(event) {
        event.preventDefault();
        if (savingProfile) return;
        setSavingProfile(true);
        setProfileMessage({ text: "", tone: "success" });

        try {
            const token = await getAccountCsrfToken(csrfToken);
            if (!csrfToken) setCsrfToken(token);
            const response = await fetch(`${API_BASE}/account/volunteer-profile`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": token,
                    },
                    body: JSON.stringify({
                        ...volunteer,
                        interests: volunteer.interests.split(",").map((item) => item.trim()).filter(Boolean),
                        skills: selectedSkills,
                    }),
                });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.message || result.error || (response.status === 401
                    ? "Your session has expired. Please sign in again."
                    : response.status === 403
                        ? "You are not authorised to update this profile."
                        : response.status === 422
                            ? "Some profile details are invalid. Please review your entries."
                            : response.status >= 500
                                ? "The account service is temporarily unavailable. Please try again shortly."
                                : "We could not save your profile. Please try again."));
            }

            setProfileMessage({ text: "Your volunteer profile has been saved successfully.", tone: "success" });
        } catch (err) {
            if (/session has expired|sign in again/i.test(err.message)) await reconcileExpiredSession();
            setProfileMessage({ text: err.message || "We could not save your profile. Please try again.", tone: "danger" });
        } finally {
            setSavingProfile(false);
        }
    }

    async function handleApplicationSubmit(event) {
        event.preventDefault();
        if (submittingApplication) return;
        setSubmittingApplication(true);
        setApplicationMessage({ text: "", tone: "success" });

        try {
            const token = await getAccountCsrfToken(csrfToken);
            if (!csrfToken) setCsrfToken(token);
            const response = await fetch(`${API_BASE}/account/applications`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": token,
                },
                body: JSON.stringify(application),
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.message || result.error || (response.status === 401
                    ? "Your session has expired. Please sign in again."
                    : response.status === 403
                        ? "You are not authorised to submit this application."
                        : response.status === 422
                            ? "Please review the application details and try again."
                            : response.status >= 500
                                ? "The application service is temporarily unavailable. Please try again shortly."
                                : "We could not submit your application. Please try again."));
            }

            const result = await response.json().catch(() => ({}));

            if (result?.application) {
                setApplications((previous) => [result.application, ...(Array.isArray(previous) ? previous : [])]);
            }

            setApplication({
                type: "volunteer",
                title: "",
                message: "",
            });

            setApplicationMessage({ text: result?.message || "Your application has been submitted successfully. The foundation team will review it and update your account.", tone: "success" });
        } catch (err) {
            if (/session has expired|sign in again/i.test(err.message)) await reconcileExpiredSession();
            setApplicationMessage({ text: err.message || "We could not submit your application. Please try again.", tone: "danger" });
        } finally {
            setSubmittingApplication(false);
        }
    }


    function handleTabKeyDown(event) {
        const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
        let nextIndex = currentIndex;
        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % TABS.length;
        else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = TABS.length - 1;
        else return;
        event.preventDefault();
        const nextTab = TABS[nextIndex];
        setActiveTab(nextTab.id);
        requestAnimationFrame(() => document.getElementById(`tab-button-${nextTab.id}`)?.focus());
    }

    function goToPage(page, fallback) {
        if (navigate) {
            navigate(page);
        } else {
            window.location.href = fallback;
        }
    }

    async function retryAccountAccess() {
        setError("");
        setLoading(true);
        setNeedsSignIn(false);
        try {
            const currentUser = await refreshSession();
            if (!currentUser) {
                setNeedsSignIn(true);
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || "We could not verify your session. Please try again.");
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container wrap py-5">
                <div className="panel p-5 text-center">
                    <div
                        className="spinner-border text-success mb-3"
                        role="status"
                        aria-label="Loading"
                        />
                    <p className="fw-semibold mb-1">
                        Loading your account
                    </p>
                    <p className="small-muted mb-0">
                        Securely retrieving your information…
                    </p>
                </div>
            </div>
        );
    }

    if (authStatus === "authenticated" && !hasPublicRole) {
        return (
            <div className="container wrap py-5">
                <section className="panel p-4 p-md-5 mx-auto" style={{ maxWidth: 620 }}>
                    <div className="eyebrow mb-2">Garden of Mercy Foundation</div>
                    <h1 className="page-title h2 mb-3">Staff account detected</h1>
                    <p className="text-secondary mb-4">
                        This account has staff access but does not have the community member role. You can continue to the secure staff workspace.
                    </p>
                    <button type="button" className="btn btn-success" onClick={() => goToPage("/admin", "/admin")}>
                        <i className="bi bi-shield-lock me-2" />Open staff workspace
                    </button>
                    <button type="button" className="btn btn-link ms-2" onClick={() => goToPage("/", "/")}>
                        Return to website
                    </button>
                </section>
            </div>
        );
    }

    if (authStatus === "unavailable" && !account) {
        return (
            <div className="container wrap py-5">
                <section className="panel p-4 p-md-5 mx-auto" style={{ maxWidth: 620 }}>
                    <div className="eyebrow mb-2">Garden of Mercy Foundation</div>
                    <h1 className="page-title h2 mb-3">Account service temporarily unavailable</h1>
                    <p className="text-secondary mb-3">
                        We could not verify your sign-in session because the account service is not responding.
                        This does not mean you have been signed out. Please try again when the service is reachable.
                    </p>
                    {error && <div className="alert alert-warning" role="alert">{error}</div>}
                    <div className="d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-success" onClick={retryAccountAccess}>
                            Try again
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => goToPage("/", "/")}>
                            Return to website
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    if (needsSignIn && !account) {
        return (
            <div className="container wrap py-5">
                <section className="panel p-4 p-md-5 mx-auto" style={{ maxWidth: 620 }}>
                    <div className="eyebrow mb-2">Garden of Mercy Foundation</div>
                    <h1 className="page-title h2 mb-3">Sign in to your account</h1>
                    <p className="text-secondary mb-4">
                        Continue with Google to manage your volunteer profile, program registrations,
                        applications, and donation history.
                    </p>
                    {error && <div className="alert alert-warning" role="alert">{error}</div>}
                    <button
                        type="button"
                        className="btn btn-light border d-flex align-items-center justify-content-center gap-3 w-100 py-3"
                        onClick={handleGoogleSignIn}
                        disabled={signingIn}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                            <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z"/>
                            <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z"/>
                            <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z"/>
                            <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4a20 20 0 0 0-18.1 10.9l6.9 5.3c1.6-4.7 6-8.1 11.2-8.1Z"/>
                        </svg>
                        <span>{signingIn ? "Connecting to Google…" : "Continue with Google"}</span>
                    </button>
                    <p className="small-muted mt-3 mb-0">
                        Staff and administrators should continue using the separate staff login.
                    </p>
                    <button className="btn btn-link mt-3 px-0" onClick={() => goToPage("/", "/")}>
                        Continue browsing as a guest
                    </button>
                </section>
            </div>
        );
    }

    if (error && !account) {
        return (
            <div className="container wrap py-5">
                <div className="alert alert-warning" role="alert">{error}</div>
                <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-success" onClick={retryAccountAccess}>Try again</button>
                    <button className="btn btn-outline-secondary" onClick={() => goToPage("/", "/")}>Return to home</button>
                </div>
            </div>
        );
    }

    const fullName = account?.fullName || account?.name || [account?.firstName, account?.lastName].filter(Boolean).join(" ") || "Community member";
    const email = account?.email || user?.email || "";
    const avatarUrl = user?.pictureUrl || user?.photoURL || account?.pictureUrl || account?.photoURL || "";
    const volunteerStatus = account?.volunteerStatus || "Not yet submitted";
    const initials = fullName.trim().charAt(0).toUpperCase() || "M";

    return (
        <div className="container wrap account-dashboard py-4 py-lg-5">
            <header className="account-dashboard-header mb-4">
                <div><div className="eyebrow mb-2">Garden of Mercy Foundation</div><h1 className="page-title h2 mb-2">Welcome back, {fullName.split(" ")[0]}</h1><p className="text-secondary mb-0">Your community, contributions and opportunities — all in one place.</p></div>
                <div className="d-flex flex-wrap gap-2">
                    {hasStaffRole && <button type="button" className="btn btn-outline-success" onClick={() => goToPage("/admin", "/admin")}><i className="bi bi-shield-lock me-2" />Administration</button>}
                    <button type="button" className="btn btn-outline-secondary" onClick={() => goToPage("/", "/")}><i className="bi bi-house me-2" />Visit website</button>
                </div>
            </header>
            {error && <div className="alert alert-warning" role="alert">{error}</div>}
            <div className="row g-4 align-items-start">
                <aside className="col-12 col-lg-3">
                    <section className="account-sidebar panel p-3">
                        <div className="account-identity d-flex align-items-center gap-3 p-2 mb-3">
                            {avatarUrl ? <img className="account-avatar" src={avatarUrl} alt="" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span className="account-avatar account-avatar-fallback" aria-hidden="true">{initials}</span>}
                            <div className="min-w-0"><strong className="d-block text-truncate">{fullName}</strong><span className="small text-secondary d-block text-break">{email}</span><span className="account-member-label"><i className="bi bi-shield-check me-1" />Community member</span></div>
                        </div>
                        <div className="account-nav-label px-2 mb-2">MEMBER MENU</div>
                        <nav className="account-navigation nav nav-pills flex-lg-column flex-nowrap" role="tablist" aria-label="Member portal sections" onKeyDown={handleTabKeyDown}>
                            {TABS.map((tab) => <button key={tab.id} id={`tab-button-${tab.id}`} className={`nav-link text-start ${activeTab === tab.id ? "active" : ""}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`tab-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)}><i className={`bi ${tab.icon} me-2`} aria-hidden="true" /><span>{tab.label}</span></button>)}
                        </nav>
                        <div className="account-sidebar-footer mt-3 pt-3 border-top"><AccountAuthPanel /><p className="small text-secondary mb-0 mt-2">Sign out when using a shared device.</p></div>
                    </section>
                </aside>
                <main className="col-12 col-lg-9 account-main" aria-label="Member account content">
                    {activeTab === "overview" && (
                        <section id="tab-overview" className="tab-panel" role="tabpanel" aria-labelledby="tab-button-overview" tabIndex={0}>
                            <div className="account-welcome panel p-4 p-md-5 mb-4"><span className="pill mb-3"><span className="pill-dot" />Your member space</span><h2 className="h3 fw-bold mb-2">Your account, your impact.</h2><p className="text-secondary mb-0">Thank you for being part of our community. Keep your details up to date and follow your involvement with the foundation.</p></div>
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-xl-3"><article className="account-stat panel p-3 h-100"><span className="account-stat-icon"><i className="bi bi-collection" /></span><strong>{registrations.length}</strong><span>Program registrations</span></article></div>
                                <div className="col-6 col-xl-3"><article className="account-stat panel p-3 h-100"><span className="account-stat-icon"><i className="bi bi-file-earmark-check" /></span><strong>{applications.length}</strong><span>Applications</span></article></div>
                                <div className="col-6 col-xl-3"><article className="account-stat panel p-3 h-100"><span className="account-stat-icon"><i className="bi bi-gift" /></span><strong>{donations.length}</strong><span>Giving records</span></article></div>
                                <div className="col-6 col-xl-3"><article className="account-stat panel p-3 h-100"><span className="account-stat-icon"><i className="bi bi-heart" /></span><strong className="account-stat-status">{volunteerStatus}</strong><span>Volunteer status</span></article></div>
                            </div>
                            <div className="panel p-4"><h2 className="panel-title mb-1">Quick access</h2><p className="small-muted mb-3">Go directly to the areas you use most.</p><div className="row g-3">
                                {TABS.filter((tab) => tab.id !== "overview").map((tab) => <div className="col-12 col-sm-6" key={tab.id}><button type="button" className="account-quick-link w-100 text-start" onClick={() => setActiveTab(tab.id)}><span className="account-quick-icon"><i className={`bi ${tab.icon}`} /></span><span className="flex-grow-1"><strong className="d-block">{tab.label}</strong><small className="text-secondary">View and manage your {tab.label.toLowerCase()}.</small></span><i className="bi bi-chevron-right text-secondary" /></button></div>)}
                            </div></div>
                        </section>
                    )}
                    {activeTab === "profile" && <div id="tab-profile" role="tabpanel" aria-labelledby="tab-button-profile" tabIndex={0}><MemberProfile user={user} initialToken={csrfToken} /></div>}
            {/* Volunteer profile */}
            {activeTab === "volunteer" && (
                <section
                    id="tab-volunteer"
                    className="tab-panel panel p-4 p-md-5 mb-4"
                    role="tabpanel"
aria-labelledby={`tab-button-${activeTab}`}
tabIndex={0}
                    >
                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                        <div>
                            <h2 className="panel-title mb-1">Volunteer profile</h2>
                            <p className="small-muted mb-0">
                                Tell us how you would like to contribute. Staff verification
                                is handled by the foundation.
                            </p>
                        </div>
                        <span className="status pending">{volunteerStatus}</span>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label" htmlFor="phone">
                                    Phone number
                                </label>
                                <input
                                className="form-control"
                                id="phone"
                                name="phone"
                                maxLength={40}
                                autoComplete="tel"
                                value={volunteer.phone}
                                onChange={updateVolunteer}
                                />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor="location">
                                Town / district
                            </label>
                            <input
                            className="form-control"
                            id="location"
                            name="location"
                            maxLength={160}
                            autoComplete="address-level2"
                            value={volunteer.location}
                            onChange={updateVolunteer}
                            />
                    </div>

                    <div className="col-12">
                        <label className="form-label" htmlFor="availability">
                            Availability
                        </label>
                        <select
                            id="availability"
                            name="availability"
                            className="form-select"
                            value={volunteer.availability}
                            onChange={updateVolunteer}
                            >
                            <option value="">Choose availability</option>
                            <option>Weekdays</option>
                            <option>Weekends</option>
                            <option>Evenings</option>
                            <option>Flexible</option>
                            <option>Occasional</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="form-label d-block">
                            Skills and experience
                        </label>
                        <div className="row g-2">
                            {SKILLS.map((skill) => (
                                <div className="col-12 col-sm-6 col-lg-4" key={skill}>
                                    <label className="form-check border rounded-3 p-3 h-100">
                                        <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        checked={selectedSkills.includes(skill)}
                                        onChange={() => toggleSkill(skill)}
                                        />
                                    <span className="form-check-label">{skill}</span>
                                </label>
                            </div>
                            ))}
                    </div>
                </div>

                <div className="col-12">
                    <label className="form-label" htmlFor="interests">
                        Areas of interest{" "}
                        <span className="fw-normal text-secondary">
                            (comma separated)
                        </span>
                    </label>
                    <input
                    className="form-control"
                    id="interests"
                    name="interests"
                    maxLength={800}
                    placeholder="Education, community outreach, child wellbeing"
                    value={volunteer.interests}
                    onChange={updateVolunteer}
                    />
            </div>

            <div className="col-12">
                <label className="form-label" htmlFor="motivation">
                    Why would you like to volunteer?
                </label>
                <textarea
                    className="form-control"
                    id="motivation"
                    name="motivation"
                    rows={4}
                    maxLength={2000}
                    placeholder="Tell us about your interests and how you hope to contribute."
                    value={volunteer.motivation}
                    onChange={updateVolunteer}
                    />
            </div>

            <div className="col-12 d-flex flex-wrap align-items-center gap-3">
                <button
                    className="btn btn-mercy"
                    type="submit"
                    disabled={savingProfile}
                    >
                    {savingProfile ? "Saving…": "Save volunteer profile"}
                </button>
                <span className="small-muted" role="status" aria-live="polite">
                    {profileMessage.text && <span className={`text-${profileMessage.tone}`}>{profileMessage.text}</span>}
                </span>
            </div>
        </div>
    </form>
</section>
)}

{/* Program registrations */}
{activeTab === "programs" && (
<section
id="tab-programs"
className="tab-panel panel p-4 p-md-5 mb-4"
role="tabpanel"
aria-labelledby="tab-button-programs"
tabIndex={0}
>
<h2 className="panel-title mb-1">Program registrations</h2>
<p className="small-muted mb-3">
Browse open programs and track your registration requests.
</p>

{programs.length === 0 ? (
<p className="text-secondary">
No programs are currently available.
</p>
): (
<div className="row g-3">
{programs.map((program) => (
<div className="col-12 col-md-6" key={program.id}>
<article className="feature h-100">
<h3 className="h6 fw-bold">
{program.title || program.name}
</h3>
<p className="small-muted">
{program.description || "Learn more about this program."}
</p>
<button
className="btn btn-outline-success btn-sm"
onClick={() => goToPage("programs", "./programs")}
>
View program
</button>
</article>
</div>
))}
</div>
)}

<hr className="my-4" />
<h3 className="h6 fw-bold">Your registrations</h3>

{registrations.length === 0 ? (
<p className="text-secondary mb-0">
You have no program registrations yet.
</p>
): (
<ul className="list-group">
{registrations.map((item) => (
<li className="list-group-item" key={item.id}>
<strong>{item.programTitle || item.title}</strong>
<span className="badge text-bg-light ms-2">
{item.status || "Pending"}
</span>
</li>
))}
</ul>
)}
</section>
)}

{/* Applications */}
{activeTab === "applications" && (
<section
id="tab-applications"
className="tab-panel panel p-4 p-md-5 mb-4"
role="tabpanel"
aria-labelledby="tab-button-applications"
tabIndex={0}
>
<h2 className="panel-title mb-1">Applications and requests</h2>
<p className="small-muted mb-3">
Submit a request and check its review status here.
</p>

<form
onSubmit={handleApplicationSubmit}
className="border rounded-3 p-3 p-md-4 mb-4"
>
<div className="row g-3">
<div className="col-12 col-md-5">
<label className="form-label" htmlFor="applicationType">
Application type
</label>
<select
className="form-select"
id="applicationType"
value={application.type}
onChange={(event) =>
setApplication((previous) => ({
...previous,
type: event.target.value,
}))
}
required
>
<option value="volunteer">Volunteer opportunity</option>
<option value="program">Program participation</option>
<option value="general_support">
General support / inquiry
</option>
</select>
</div>

<div className="col-12 col-md-7">
<label className="form-label" htmlFor="applicationTitle">
Title
</label>
<input
className="form-control"
id="applicationTitle"
maxLength={180}
minLength={3}
required
placeholder="What are you applying for?"
value={application.title}
onChange={(event) =>
setApplication((previous) => ({
...previous,
title: event.target.value,
}))
}
/>
</div>

<div className="col-12">
<label className="form-label" htmlFor="applicationMessage">
Details
</label>
<textarea
className="form-control"
id="applicationMessage"
rows={4}
minLength={10}
maxLength={5000}
required
placeholder="Share the relevant details…"
value={application.message}
onChange={(event) =>
setApplication((previous) => ({
...previous,
message: event.target.value,
}))
}
/>
</div>

<div className="col-12">
<button className="btn btn-mercy" type="submit" disabled={submittingApplication}>
Submit application
</button>
</div>

{applicationMessage.text && (
<div className="col-12">
<p className={`mb-0 text-${applicationMessage.tone}`} role={applicationMessage.tone === "danger" ? "alert" : "status"} aria-live="polite">
{applicationMessage.text}
</p>
</div>
)}
</div>
</form>

{applications.length === 0 ? (
<p className="text-secondary mb-0">
You have not submitted any applications yet.
</p>
): (
<div className="d-grid gap-3">
{applications.map((item) => (
<article className="feature" key={item.id}>
<div className="d-flex justify-content-between flex-wrap gap-2">
<h3 className="h6 fw-bold mb-1">{item.title}</h3>
<span className="badge text-bg-light">
{item.status || "Under review"}
</span>
</div>
<p className="small-muted mb-0">
{item.message || item.details}
</p>
</article>
))}
</div>
)}
</section>
)}

{activeTab === "sponsorship" && (
                <div id="tab-sponsorship" role="tabpanel" aria-labelledby="tab-button-sponsorship" tabIndex={0}>
                    <SponsorPortal />
                </div>
            )}

            {activeTab === "volunteerService" && (
                <div id="tab-volunteerService" role="tabpanel" aria-labelledby="tab-button-volunteerService" tabIndex={0}>
                    <VolunteerPortal />
                </div>
            )}

{/* Donation history */}
{activeTab === "donations" && (
<section
id="tab-donations"
className="tab-panel panel p-4 p-md-5 mb-4"
role="tabpanel"
aria-labelledby="tab-button-donations"
tabIndex={0}
>
<h2 className="panel-title mb-1">Donation history</h2>
<p className="small-muted mb-3">
Donation records associated with your signed-in account email.
Only confirmed payments should be considered completed.
</p>

{donationsLoadError ? (
                <div className="alert alert-warning mb-0" role="status">Donation history could not be loaded from your account response. Please refresh and try again.</div>
                ) : donations.length === 0 ? (
<p className="text-secondary mb-0">
No donation records were found for your account.
</p>
): (
<div className="table-responsive">
<table className="table align-middle">
<thead>
<tr>
<th scope="col">Date</th>
<th scope="col">Reference</th>
<th scope="col">Amount</th>
<th scope="col">Status</th>
</tr>
</thead>
<tbody>
{donations.map((donation) => (
<tr key={donation.id}>
<td>
{(donation.date || donation.created_at)
? new Date(donation.date || donation.created_at).toLocaleDateString(): "—"}
</td>
<td>{donation.reference || donation.merchant_reference || "—"}</td>
<td>
{donation.amount != null
? `${donation.currency || "UGX"} ${donation.amount}`: "—"}
</td>
<td>
<span className="badge text-bg-light">
{donation.status || "Unconfirmed"}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
)}
</section>
)}
</main>
            </div>
        </div>
    );
}

export default Account;