const MAX_DONATION_AMOUNT = 100_000_000;
const ALLOWED_CURRENCIES = new Set(["UGX", "USD"]);
const ALLOWED_PURPOSES = new Set(["general", "children", "community", "emergency"]);
const ALLOWED_FREQUENCIES = new Set(["one-time", "monthly"]);

export function validateDonation(form) {
  const amount = Number(form.amount);

  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_DONATION_AMOUNT) {
    return "Enter a donation amount greater than zero and no more than 100,000,000.";
  }
  if (form.currency && !ALLOWED_CURRENCIES.has(form.currency)) {
    return "Choose a supported donation currency.";
  }
  if (form.currency === "UGX" && !Number.isInteger(amount)) {
    return "Enter a whole-number amount for Uganda shillings.";
  }
  if (form.purpose && !ALLOWED_PURPOSES.has(form.purpose)) {
    return "Choose a valid donation purpose.";
  }
  if (form.frequency && !ALLOWED_FREQUENCIES.has(form.frequency)) {
    return "Choose a valid donation frequency.";
  }
  if (!form.name?.trim()) return "Enter your full name.";
  if (!form.email?.trim() && !form.phone?.trim()) {
    return "Enter an email address or phone number.";
  }
  if (form.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email.trim())) {
    return "Enter a valid email address.";
  }
  return "";
}
