import { spawnSync } from "node:child_process";

if (process.env.GOOGLE_TRANSLATE_API_KEY) {
  console.log("Generating available machine translations before the production build...");
  const translation = spawnSync(process.execPath, ["scripts/generate-translations.js"], {
    stdio: "inherit",
    env: process.env
  });
  if (translation.error) {
    console.warn("Translation generation could not start; continuing with committed locale resources.", translation.error.message);
  } else if (translation.status !== 0) {
    console.warn("Some translations could not be generated; continuing with available locale resources.");
  }
} else {
  console.log("GOOGLE_TRANSLATE_API_KEY is not configured; building with committed locale resources and English fallback.");
}

const build = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "build"], {
  stdio: "inherit",
  env: process.env
});
if (build.error) {
  console.error(build.error);
  process.exit(1);
}
process.exit(build.status ?? 1);
