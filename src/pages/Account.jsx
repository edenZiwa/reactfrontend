import React, { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const SKILLS = [
    "Teaching",
    "Childcare",
    "Counselling",
    "Healthcare",
    "Administration",
    "Fundraising",
    "Community outreach",
    "IT and media",
];

const TABS = [{
    id: "volunteer",
    label: "Volunteer profile"
},
    {
        id: "programs",
        label: "Program registrations"
    },
    {
        id: "applications",
        label: "Applications"
    },
    {
        id: "donations",
        label: "Donation history"
    },
];

function Account( {
    navigate
}) {
    const [loading,
        setLoading] = useState(true);
    const [account,
        setAccount] = useState(null);
    const [error,
        setError] = useState("");
    const [activeTab,
        setActiveTab] = useState("volunteer");
    const [savingProfile,
        setSavingProfile] = useState(false);
    const [profileMessage,
        setProfileMessage] = useState("");
    const [applicationMessage,
        setApplicationMessage] = useState("");
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

    useEffect(() => {
        let cancelled = false;

        async function loadAccount() {
            try {
                const response = await fetch(`${API_BASE}/account`, {
                    credentials: "include",
                });

                if (response.status === 401) {
                    if (!cancelled) {
                        setError("Please sign in to view your account.");
                    }
                    return;
                }

                if (!response.ok) {
                    throw new Error("Unable to load your account.");
                }

                const data = await response.json();

                if (cancelled) return;

                setAccount(data?.user ?? data ?? null);
                const profile = data?.volunteerProfile ?? {};

                setVolunteer({
                    phone: profile.phone ?? "",
                    location: profile.location ?? "",
                    availability: profile.availability ?? "",
                    interests: profile.interests ?? "",
                    motivation: profile.motivation ?? "",
                });

                setSelectedSkills(Array.isArray(profile.skills) ? profile.skills : []);
                setPrograms(Array.isArray(data?.programs) ? data.programs : []);
                setRegistrations(Array.isArray(data?.registrations) ? data.registrations : []);
                setApplications(Array.isArray(data?.applications) ? data.applications : []);
                setDonations(Array.isArray(data?.donations) ? data.donations : []);
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
        []);

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
        setSavingProfile(true);
        setProfileMessage("");

        try {
            const response = await fetch(`${API_BASE}/account/volunteer-profile`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...volunteer,
                        skills: selectedSkills,
                    }),
                });

            if (!response.ok) {
                throw new Error("Unable to save your profile. Please try again.");
            }

            setProfileMessage("Your volunteer profile has been saved.");
        } catch (err) {
            setProfileMessage(err.message);
        } finally {
            setSavingProfile(false);
        }
    }

    async function handleApplicationSubmit(event) {
        event.preventDefault();
        setApplicationMessage("");

        try {
            const response = await fetch(`${API_BASE}/account/applications`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(application),
            });

            if (!response.ok) {
                throw new Error("Unable to submit your application.");
            }

            const result = await response.json();

            if (result?.application) {
                setApplications((previous) => [result.application, ...(Array.isArray(previous) ? previous : [])]);
            }

            setApplication({
                type: "volunteer",
                title: "",
                message: "",
            });

            setApplicationMessage("Your application has been submitted.");
        } catch (err) {
            setApplicationMessage(err.message);
        }
    }

    async function handleLogout(event) {
        event.preventDefault();

        try {
            const response = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Unable to sign out. Please try again.");
            }

            if (navigate) {
                navigate("/");
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function goToPage(page, fallback) {
        if (navigate) {
            navigate(page);
        } else {
            window.location.href = fallback;
        }
    }

    if (loading) {
        return (
            <main className="container wrap py-5">
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
            </main>
        );
    }

    if (error && !account) {
        return (
            <main className="container wrap py-5">
                <div className="alert alert-warning" role="alert">
                    {error}
                </div>
                <button
                    className="btn btn-success"
                    onClick={() => goToPage("/", "/")}
                    >
                    Return to home
                </button>
            </main>
        );
    }

    const fullName = account?.fullName || account?.name || "Community member";
    const email = account?.email || "";
    const volunteerStatus =
    account?.volunteerStatus || "Not yet submitted";
    const initials = fullName.trim().charAt(0).toUpperCase() || "M";

    return (
        <main className="container wrap py-4 py-md-5">
            <div className="mb-4">
                <div className="eyebrow mb-2">
                    Community member portal
                </div>
                <h1 className="page-title h2 mb-2">Your account, your impact</h1>
                <p className="text-secondary mb-0">
                    Manage your volunteer profile, register for programs, and follow
                    your activity with the foundation.
                </p>
            </div>

            {error && (
                <div className="alert alert-warning" role="alert">
                    {error}
                </div>
            )}

            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-7">
                    <section className="panel h-100">
                        <div className="banner" />
                        <div className="profile-body">
                            <div className="profile-head mb-4">
                                <div className="avatar" aria-hidden="true">
                                    {initials}
                                </div>
                                <div className="pb-1 flex-grow-1">
                                    <span className="pill mb-2">
                                        <span className="pill-dot" /> Public account
                                    </span>
                                    <h2 className="h4 fw-bold mb-1">{fullName}</h2>
                                    <p className="small-muted mb-0">
                                        {email}
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="detail">
                                        <span className="detail-label">Account type</span>
                                        <div className="detail-value">
                                            Community user
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="detail">
                                        <span className="detail-label">Volunteer status</span>
                                        <div className="detail-value">
                                            {volunteerStatus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleLogout} className="mt-4 pt-3 border-top">
                                <button className="btn btn-outline-mercy" type="submit">
                                    ↪ Sign out securely
                                </button>
                                <p className="small-muted mt-2 mb-0">
                                    Remember to sign out on shared devices.
                                </p>
                            </form>
                        </div>
                    </section>
                </div>

                <div className="col-12 col-lg-5">
                    <section className="panel p-4 h-100">
                        <h2 className="panel-title mb-1">Stay connected</h2>
                        <p className="small-muted mb-3">
                            Explore opportunities to make a difference.
                        </p>

                        <div className="d-grid gap-3">
                            <button
                                className="feature d-flex gap-3 align-items-center text-start border-0 bg-transparent"
                                onClick={() => goToPage("programs", "./programs")}
                                >
                                <span className="feature-icon">✳</span>
                                <span>
                                    <strong className="d-block">Community programs</strong>
                                    <span className="small-muted">
                                        Discover current initiatives.
                                    </span>
                                </span>
                            </button>

                            <button
                                className="feature d-flex gap-3 align-items-center text-start border-0 bg-transparent"
                                onClick={() => goToPage("donate", "./donate")}
                                >
                                <span className="feature-icon">♡</span>
                                <span>
                                    <strong className="d-block">Support our mission</strong>
                                    <span className="small-muted">
                                        Help fund meaningful work.
                                    </span>
                                </span>
                            </button>

                            <button
                                className="feature d-flex gap-3 align-items-center text-start border-0 bg-transparent"
                                onClick={() => goToPage("contact", "./contact")}
                                >
                                <span className="feature-icon">✉</span>
                                <span>
                                    <strong className="d-block">Contact the foundation</strong>
                                    <span className="small-muted">
                                        Ask a question or get support.
                                    </span>
                                </span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Dashboard tabs */}
            <section className="panel p-3 p-md-4 mb-4">
                <div className="nav nav-pills flex-wrap gap-2" role="tablist">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            id={`tab-button-${tab.id}`}
                            className={`nav-link ${activeTab === tab.id ? "active": ""}`}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`tab-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Volunteer profile */}
            {activeTab === "volunteer" && (
                <section
                    id="tab-volunteer"
                    className="tab-panel panel p-4 p-md-5 mb-4"
                    role="tabpanel"
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
                    {profileMessage}
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
<button className="btn btn-mercy" type="submit">
Submit application
</button>
</div>

{applicationMessage && (
<div className="col-12">
<p className="small-muted mb-0" role="status" aria-live="polite">
{applicationMessage}
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

{/* Donation history */}
{activeTab === "donations" && (
<section
id="tab-donations"
className="tab-panel panel p-4 p-md-5 mb-4"
role="tabpanel"
>
<h2 className="panel-title mb-1">Donation history</h2>
<p className="small-muted mb-3">
Donation records associated with your signed-in account email.
Only confirmed payments should be considered completed.
</p>

{donations.length === 0 ? (
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
{donation.date
? new Date(donation.date).toLocaleDateString(): "—"}
</td>
<td>{donation.reference || "—"}</td>
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
);
}

export default Account;