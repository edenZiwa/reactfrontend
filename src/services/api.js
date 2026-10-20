const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json", ...(options.headers || {})
        }, ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status}).`);
    return data;
}
export async function startDonation(payload) {
    return request("/donations", {
        method: "POST", body: JSON.stringify(payload)
    });
}
export async function getDonationStatus(reference) {
    return request(`/donations/${encodeURIComponent(reference)}`);
}
export function describeDonationStatus(status) {
    const details = {
        completed: {
            tone: "success",
            title: "Donation confirmed",
            message: "Your donation has been confirmed. Thank you for supporting the foundation.",
        },
        pending: {
            tone: "pending",
            title: "Donation being verified",
            message: "Your donation is being verified. This page will update when the backend receives a confirmed status.",
        },
        failed: {
            tone: "error",
            title: "Payment not completed",
            message: "The payment was not completed. You can return to the donation page and try again.",
        },
        reversed: {
            tone: "error",
            title: "Payment reversed",
            message: "This payment was reversed. Please contact the foundation if you need assistance.",
        },
    };
    return details[String(status || "").toLowerCase()] || {
        tone: "pending",
        title: "Checking donation status",
        message: "We are checking the donation status. Please wait or check again shortly.",
    };
}
