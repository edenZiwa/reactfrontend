import test from "node:test";
import assert from "node:assert/strict";
import { validateDonation } from "../src/services/donation-validation.js";

const valid = {
  amount: 25000,
  currency: "UGX",
  name: "A donor",
  email: "donor@example.org",
  phone: "",
  purpose: "general",
  frequency: "one-time",
};

test("accepts a valid whole-number UGX donation", () => {
  assert.equal(validateDonation(valid), "");
});

test("rejects zero, negative, non-finite and excessive amounts", () => {
  for (const amount of [0, -1, NaN, Infinity, 100000001]) {
    assert.notEqual(validateDonation({ ...valid, amount }), "");
  }
});

test("requires whole-number UGX amounts", () => {
  assert.match(validateDonation({ ...valid, amount: 25.5 }), /whole-number/);
});

test("allows decimal USD amounts", () => {
  assert.equal(validateDonation({ ...valid, amount: 25.5, currency: "USD" }), "");
});

test("rejects unsupported currencies, purposes and frequencies", () => {
  assert.match(validateDonation({ ...valid, currency: "EUR" }), /currency/);
  assert.match(validateDonation({ ...valid, purpose: "other" }), /purpose/);
  assert.match(validateDonation({ ...valid, frequency: "weekly" }), /frequency/);
});

test("requires a donor name and at least one valid contact method", () => {
  assert.match(validateDonation({ ...valid, name: " " }), /full name/);
  assert.match(validateDonation({ ...valid, email: "", phone: "" }), /email address or phone number/);
  assert.match(validateDonation({ ...valid, email: "not-an-email" }), /valid email/);
});
