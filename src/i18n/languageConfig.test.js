import test from "node:test";
import assert from "node:assert/strict";
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getLanguage,
  getAvailableLanguages
} from "./languageConfig.js";

test("language catalogue has unique codes and a valid English default", () => {
  const codes = LANGUAGES.map(language => language.code);
  assert.ok(codes.length >= 70, "catalogue should include a broad language selection");
  assert.equal(new Set(codes).size, codes.length, "language codes must be unique");
  assert.ok(LANGUAGES.some(language => language.code === DEFAULT_LANGUAGE && language.ready));
  assert.equal(DEFAULT_LANGUAGE, "en");
});

test("all catalogue entries have display names and direction", () => {
  for (const language of LANGUAGES) {
    assert.ok(language.code && language.name && language.nativeName);
    assert.ok(["ltr", "rtl"].includes(language.direction));
  }
});

test("right-to-left languages are configured explicitly", () => {
  for (const code of ["ar", "fa", "he", "ur"]) {
    assert.equal(getLanguage(code).direction, "rtl");
  }
});

test("only languages with available resources are marked ready", () => {
  assert.deepEqual(getAvailableLanguages().map(language => language.code), ["en"]);
  assert.equal(LANGUAGE_STORAGE_KEY, "gomf-language");
});

test("unknown language safely falls back to English", () => {
  assert.equal(getLanguage("not-a-language").code, "en");
});
