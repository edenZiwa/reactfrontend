import test from "node:test";
import assert from "node:assert/strict";
import { resolveApiConfig } from "../src/services/api-url.js";

test("production uses the absolute API origin and preserves /api base", () => {
  assert.deepEqual(resolveApiConfig({
    value: "https://api.gardenofmercy.org/api",
    production: true,
  }), {
    apiBase: "https://api.gardenofmercy.org/api",
    apiOrigin: "https://api.gardenofmercy.org",
    error: "",
  });
});

test("production rejects relative and malformed API hosts safely", () => {
  for (const value of [
    "/api.gardenofmercy.org/api",
    "api.gardenofmercy.org/api",
    "http://api.gardenofmercy.org/api",
    "https://gardenofmercy.org/api",
    "https://api.gardenofmercy.org/api/v1",
    "https://api.gardenofmercy.org/api?x=1",
    "",
  ]) {
    const result = resolveApiConfig({ value, production: true });
    assert.equal(result.apiBase, "/api", value);
    assert.equal(result.apiOrigin, "", value);
    assert.ok(result.error, value);
  }
});

test("development supports same-origin proxy and absolute API URLs", () => {
  assert.deepEqual(resolveApiConfig({ value: "/api" }), {
    apiBase: "/api", apiOrigin: "", error: "",
  });
  assert.deepEqual(resolveApiConfig({ value: "http://localhost:4000/api" }), {
    apiBase: "http://localhost:4000/api",
    apiOrigin: "http://localhost:4000",
    error: "",
  });
});

test("production normalizes a trailing slash without creating a malformed origin", () => {
  assert.deepEqual(resolveApiConfig({
    value: "https://api.gardenofmercy.org/api/",
    production: true,
  }), {
    apiBase: "https://api.gardenofmercy.org/api",
    apiOrigin: "https://api.gardenofmercy.org",
    error: "",
  });
});
