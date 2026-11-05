const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

function statusMessage(status, fallback) {
    const messages = {
        400: "Some of the information is missing or invalid. Please review the form and try again.",
        401: "Your session may have expired. Please sign in again and retry.",
        403: "You do not have permission to complete this action.",
        404: "We could not find the requested record. Refresh the page and try again.",
        409: "This request conflicts with an existing record. Refresh the page to see the latest information.",
        422: "Please review the information you entered and correct any highlighted fields.",
        429: "Too many requests were made. Please wait a moment before trying again.",
    };
    return messages[status] || (status >= 500
        ? "The foundation service is temporarily unavailable. Please try again shortly."
        : fallback || "We could not complete your request. Please try again.");
}

async function request(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            headers: { Accept: "application/json", "Content-Type": "application/json", ...(options.headers || {}) },
            ...options,
        });
    } catch {
        throw new Error("We could not reach the foundation service. Check your internet connection and try again.");
    }

    const contentType = response.headers.get("content-type") || "";
    let data = {};
    if (response.status !== 204) {
        if (contentType.toLowerCase().includes("application/json")) {
            data = await response.json().catch(() => ({}));
        } else {
            const body = await response.text().catch(() => "");
            if (body.trimStart().startsWith("<")) {
                throw new Error("The service returned an unexpected webpage. Please try again later or contact the foundation.");
            }
        }
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || statusMessage(response.status));
    }
    return data;
}

export async function startDonation(payload) {
    return request("/donations", { method: "POST", body: JSON.stringify(payload) });
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
            message: "Your payment is still being verified. You do not need to make another payment while this check is pending. You can check again shortly.",
        },
        failed: {
            tone: "error",
            title: "Payment not completed",
            message: "The payment was not completed. You can return to the donation page and try again. If money was deducted, please contact the foundation before making another payment.",
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
