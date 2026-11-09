import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../src/i18n/languageConfig.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src/i18n/locales", DEFAULT_LANGUAGE);
const outputDir = path.join(root, "src/i18n/locales");
const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

if (!apiKey) {
  console.error("Missing GOOGLE_TRANSLATE_API_KEY. Supply it as a CI secret or local environment variable.");
  process.exit(1);
}

const translateText = async (text, target) => {
  const response = await fetch("https://translation.googleapis.com/language/translate/v2?key=" + encodeURIComponent(apiKey), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ q: text, source: "en", target, format: "text" })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Translation API returned ${response.status}: ${detail.slice(0, 300)}`);
  }
  const payload = await response.json();
  const translated = payload?.data?.translations?.[0]?.translatedText;
  if (typeof translated !== "string") throw new Error("Translation API returned no translated text.");
  return translated;
};

const translateValue = async (value, target) => {
  if (typeof value === "string") return translateText(value, target);
  if (Array.isArray(value)) return Promise.all(value.map(item => translateValue(item, target)));
  if (value && typeof value === "object") {
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [
      key, await translateValue(item, target)
    ]));
    return Object.fromEntries(entries);
  }
  return value;
};

const sources = await Promise.all(
  (await import("node:fs/promises")).readdir(sourceDir)
    .then(names => names.filter(name => name.endsWith(".json")))
    .then(names => Promise.all(names.map(async name => [
      name, JSON.parse(await readFile(path.join(sourceDir, name), "utf8"))
    ])))
);

const report = { generated: [], unsupportedOrFailed: [] };
for (const language of LANGUAGES.filter(item => item.code !== DEFAULT_LANGUAGE)) {
  try {
    const translatedFiles = await Promise.all(sources.map(async ([name, content]) => [
      name, await translateValue(content, language.code)
    ]));
    const targetDir = path.join(outputDir, language.code);
    await mkdir(targetDir, { recursive: true });
    await Promise.all(translatedFiles.map(([name, content]) =>
      writeFile(path.join(targetDir, name), JSON.stringify(content, null, 2) + "\n", "utf8")
    ));
    report.generated.push(language.code);
    console.log(`Generated ${language.code} (${language.name})`);
  } catch (error) {
    report.unsupportedOrFailed.push({ code: language.code, reason: error.message });
    console.warn(`Skipped ${language.code} (${language.name}): ${error.message}`);
  }
}
console.log(JSON.stringify(report, null, 2));
if (report.generated.length === 0) process.exitCode = 1;
