import React, {
    useState
} from "react";
import { Eyebrow } from "../components/SiteChrome.jsx";

const initialForm = {
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
};

function Contact( {
    navigate
}) {
    const [form,
        setForm] = useState(initialForm);
    const [errors,
        setErrors] = useState( {});
    const [notice,
        setNotice] = useState("");

    const updateField = (event) => {
        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setNotice("");

    };

    const validateForm = () => {
        const nextErrors = {};

        if (!form.name.trim()) {
            nextErrors.name = "Please enter your name.";
        }

        if (!form.email.trim()) {
            nextErrors.email = "Please enter your email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (!form.message.trim()) {
            nextErrors.message = "Please enter your message.";
        } else if (form.message.trim().length < 10) {
            nextErrors.message = "Your message must be at least 10 characters.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;

    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        // Connect this handler to your backend contact endpoint before publishing.
        setNotice(
            "Your message has been validated, but it has not been sent. Please connect the contact form to the foundation's backend."
        );

    };

    const openPage = (page, fallback) => {
        if (typeof navigate === "function") {
            navigate(page);
        } else {
            window.location.href = fallback;
        }
    };

    return (
        <>
        <section className="contact-hero" aria-labelledby="contact-hero-title">
            <div className="contact-hero-overlay" aria-hidden="true" />
            <div className="container contact-hero-inner">
                <div className="row align-items-center g-5">
                    <div className="col-lg-7">
                        <div className="contact-hero-copy">
                            <span className="contact-hero-eyebrow">
                                <span className="contact-hero-eyebrow-dot" aria-hidden="true" />
                                GARDEN OF MERCY FOUNDATION
                            </span>
                            <h1 id="contact-hero-title" className="contact-hero-title">
                                Let’s start a <em>conversation.</em>
                                <span>Good things begin when we connect.</span>
                            </h1>
                            <p className="contact-hero-description">
                                Whether you have a question, a partnership idea or a desire
                                to serve, we would be glad to hear from you. Let’s explore
                                how we can bring more mercy, dignity and hope to communities.
                            </p>
                            <div className="contact-hero-actions">
                                <a href="#contact-form" className="btn contact-hero-primary">
                                    Send us a message
                                    <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                                </a>
                                <a href="#contact-details" className="btn contact-hero-secondary">
                                    Explore ways to connect
                                </a>
                            </div>
                            <div className="contact-hero-points" aria-label="We welcome">
                                <span><i className="bi bi-chat-heart-fill" aria-hidden="true" /> Questions</span>
                                <span><i className="bi bi-people-fill" aria-hidden="true" /> Partnerships</span>
                                <span><i className="bi bi-heart-fill" aria-hidden="true" /> Volunteers</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <aside className="contact-hero-card" aria-label="Ways to connect with the Foundation">
                            <div className="contact-hero-card-heading">
                                <span className="contact-hero-card-icon" aria-hidden="true">
                                    <i className="bi bi-envelope-paper-heart" />
                                </span>
                                <span className="contact-hero-card-kicker">A GOOD PLACE TO BEGIN</span>
                            </div>
                            <h2>What would you like to talk about?</h2>
                            <p className="contact-hero-card-intro">
                                Whatever brings you here, we welcome the opportunity to connect.
                            </p>
                            <ul className="contact-hero-topics">
                                <li>
                                    <span className="contact-hero-topic-icon"><i className="bi bi-chat-left-text" aria-hidden="true" /></span>
                                    <span><strong>Ask a question</strong><small>Learn more about our mission and work.</small></span>
                                </li>
                                <li>
                                    <span className="contact-hero-topic-icon"><i className="bi bi-people" aria-hidden="true" /></span>
                                    <span><strong>Explore a partnership</strong><small>Share an idea for serving communities.</small></span>
                                </li>
                                <li>
                                    <span className="contact-hero-topic-icon"><i className="bi bi-heart" aria-hidden="true" /></span>
                                    <span><strong>Get involved</strong><small>Offer your time, skills or support.</small></span>
                                </li>
                            </ul>
                            <a href="#contact-form" className="contact-hero-card-link">
                                Start your conversation
                                <i className="bi bi-arrow-right" aria-hidden="true" />
                            </a>
                            <span className="contact-hero-card-watermark" aria-hidden="true">
                                <i className="bi bi-flower1" />
                            </span>
                        </aside>
                        <p className="contact-hero-caption">
                            <i className="bi bi-heart-fill me-2" aria-hidden="true" />
                            Sowing seeds of mercy and compassion.
                        </p>
                    </div>
                </div>
            </div>
        </section>
            <main id="main-content">
                {/* Contact introduction */}
                <section id="contact-details" className="contact-section py-5">
                    <div className="container">
                        <div className="row g-5 align-items-start">
                            <div className="col-lg-5">
                                <Eyebrow>CONNECT WITH US</Eyebrow>

                                <h2 className="display-6 fw-bold mt-3 mb-4">
                                    Good work grows through <em>connection.</em>
                                </h2>

                                <p className="text-secondary mb-4">
                                    Every meaningful partnership begins with a conversation.
                                    Reach out to learn more about Garden of Mercy Foundation,
                                    our child-focused mission and opportunities to serve
                                    communities together.
                                </p>

                                <div className="contact-card d-flex align-items-start gap-3 p-4 mb-3 rounded-4">
                                    <div className="contact-icon" aria-hidden="true">
                                        <i className="bi bi-envelope-heart" />
                                    </div>

                                    <div>
                                        <h3 className="h5 fw-bold mb-2">General inquiries</h3>
                                        <p className="text-secondary mb-0">
                                            Ask questions about our mission, activities or how to
                                            get involved. Use the message form to share your inquiry.
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-card d-flex align-items-start gap-3 p-4 mb-3 rounded-4">
                                    <div className="contact-icon" aria-hidden="true">
                                        <i className="bi bi-people" />
                                    </div>

                                    <div>
                                        <h3 className="h5 fw-bold mb-2">
                                            Community partnerships
                                        </h3>
                                        <p className="text-secondary mb-0">
                                            Have an idea for a community initiative or collaboration?
                                            Tell us about it so the foundation can review your proposal.
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-card d-flex align-items-start gap-3 p-4 rounded-4">
                                    <div className="contact-icon" aria-hidden="true">
                                        <i className="bi bi-heart" />
                                    </div>

                                    <div>
                                        <h3 className="h5 fw-bold mb-2">Support our mission</h3>
                                        <p className="text-secondary mb-0">
                                            Discover ways to contribute your time, skills or resources
                                            toward compassionate service.
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-scripture mt-4 p-4 rounded-4">
                                    <i
                                        className="bi bi-quote fs-2"
                                        aria-hidden="true"
                                        />
                                    <p className="mb-2 fw-semibold">
                                        “for I was hungry and you gave Me food; I was thirsty and you gave Me drink;  I was a stranger and you took Me in;”
                                    </p>
                                    <span className="small text-secondary">
                                        Matthew 25:35
                                    </span>
                                </div>
                            </div>

                            {/* Contact form */}
                            <div className="col-lg-7">
                                <div id="contact-form" className="contact-form-card p-4 p-md-5 rounded-4 shadow-sm">
                                    <span className="contact-form-label">
                                        WE’RE HERE TO LISTEN
                                    </span>

                                    <h2 className="h2 fw-bold mt-2 mb-2">
                                        Send us a message
                                    </h2>

                                    <p className="text-secondary mb-4">
                                        Complete the details below to prepare your inquiry.
                                        Fields marked with * are required.
                                    </p>

                                    {notice && (
                                        <div
                                            className="alert alert-info"
                                            role="status"
                                            aria-live="polite"
                                            >
                                            {notice}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="contact-name" className="form-label">
                                                    Full name *
                                                </label>

                                                <input
                                                id="contact-name"
                                                name="name"
                                                type="text"
                                                className={`form-control ${
                                                errors.name ? "is-invalid": ""
                                                }`}
                                                placeholder="Your full name"
                                                value={form.name}
                                                onChange={updateField}
                                                autoComplete="name"
                                                aria-invalid={Boolean(errors.name)}
                                                aria-describedby={
                                                errors.name ? "contact-name-error": undefined
                                                }
                                                required
                                                />

                                            {errors.name && (
                                                <div
                                                    id="contact-name-error"
                                                    className="invalid-feedback"
                                                    >
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="contact-email" className="form-label">
                                                Email address *
                                            </label>

                                            <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            className={`form-control ${
                                            errors.email ? "is-invalid": ""
                                            }`}
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={updateField}
                                            autoComplete="email"
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={
                                            errors.email ? "contact-email-error": undefined
                                            }
                                            required
                                            />

                                        {errors.email && (
                                            <div
                                                id="contact-email-error"
                                                className="invalid-feedback"
                                                >
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="contact-subject"
                                            className="form-label"
                                            >
                                            What would you like to discuss?
                                        </label>

                                        <select
                                            id="contact-subject"
                                            name="subject"
                                            className="form-select"
                                            value={form.subject}
                                            onChange={updateField}
                                            >
                                            <option>General Inquiry</option>
                                            <option>Volunteering</option>
                                            <option>Community Partnership</option>
                                            <option>Programs and Initiatives</option>
                                            <option>Donations and Support</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="contact-message"
                                            className="form-label"
                                            >
                                            Your message *
                                        </label>

                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            rows="6"
                                            maxLength={3000}
                                            className={`form-control ${
                                            errors.message ? "is-invalid": ""
                                            }`}
                                            placeholder="Tell us how we can help or how you would like to work together..."
                                            value={form.message}
                                            onChange={updateField}
                                            aria-invalid={Boolean(errors.message)}
                                            aria-describedby={
                                            errors.message
                                            ? "contact-message-error": "contact-message-count"
                                            }
                                            required
                                            />

                                        {errors.message && (
                                            <div
                                                id="contact-message-error"
                                                className="invalid-feedback"
                                                >
                                                {errors.message}
                                            </div>
                                        )}

                                        <div
                                            id="contact-message-count"
                                            className="text-end small text-secondary mt-1"
                                            >
                                            {form.message.length}/3000 characters
                                        </div>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg px-4 w-100 contact-submit"
                                            >
                                            Prepare message
                                            <i
                                                className="bi bi-arrow-right ms-2"
                                                aria-hidden="true"
                                                />
                                        </button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Final call to action */}
        <section className="contact-cta-section py-5">
            <div className="container">
                <div className="contact-cta rounded-4 p-4 p-md-5 text-center">
                    <div className="contact-cta-icon mb-3" aria-hidden="true">
                        <i className="bi bi-flower1" />
                    </div>

                    <Eyebrow>LET’S MAKE A DIFFERENCE</Eyebrow>

                    <h2 className="fw-bold mt-3">
                        Together, we can sow seeds of mercy.
                    </h2>

                    <p className="text-secondary mx-auto my-3 contact-cta-text">
                        Explore the foundation’s work and discover how your time,
                        ideas and support can help advance a more compassionate future.
                    </p>

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2"
                            onClick={() => openPage("programs", "./programs")}
                            >
                            Explore our programs
                            <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-success px-4 py-2"
                            onClick={() => openPage("donate", "./donate")}
                            >
                            Support our work
                            <i className="bi bi-heart ms-2" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>
</>

);
}

export default Contact;