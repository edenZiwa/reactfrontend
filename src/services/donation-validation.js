export function validateDonation(form) {
  if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) return "Enter a valid donation amount.";
  if (!form.name?.trim()) return "Enter your full name.";
  if (!form.email?.trim() && !form.phone?.trim()) return "Enter an email address or phone number.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
  return "";
}
