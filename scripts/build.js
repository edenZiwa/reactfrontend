import { spawnSync } from "node:child_process";

const hasTranslationProvider = Boolean(
  process.env.AZURE_TRANSLATOR_KEY || process.env.DEEPL_AUTH_KEY
);

if (hasTranslationProvider) {
  console.log("Generating Azure-first translations with DeepL fallback before the production build...");
  const translation = spawnSync(process.execPath, ["scripts/generate-translations.js"], {
    stdio: "inherit",
    env: process.env
  });
  if (translation.error) {
    console.warn("Translation generation could not start; continuing with committed locale resources.", translation.error.message);
  } else if (translation.status !== 0) {
    console.warn("Translation generation was incomplete; continuing with the successfully generated locale resources.");
  }
} else {
  console.log("No Azure/DeepL credentials configured; building with committed locale resources and English fallback.");
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
