import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../src/i18n/languageConfig.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src/i18n/locales", DEFAULT_LANGUAGE);
const outputDir = path.join(root, "public/locales");

const azureKey = process.env.AZURE_TRANSLATOR_KEY;
const azureRegion = process.env.AZURE_TRANSLATOR_REGION;
const azureEndpoint = (process.env.AZURE_TRANSLATOR_ENDPOINT || "https://api.cognitive.microsofttranslator.com").replace(/\/$/, "");
const deeplKey = process.env.DEEPL_AUTH_KEY;
const deeplEndpoint = (process.env.DEEPL_API_URL || "https://api-free.deepl.com").replace(/\/$/, "");

const AZURE_CODES = {
  lg: "lug", sw: "sw", rw: "rw", rn: "rn", so: "so", om: "om", ha: "ha",
  yo: "yo", ig: "ig", wo: "wo", ln: "ln", zu: "zu", xh: "xh", sn: "sn",
  af: "af", am: "am", ti: "ti", mg: "mg", ny: "ny", st: "st", tn: "tn",
  ss: "ss", fr: "fr", es: "es", pt: "pt", de: "de", it: "it", nl: "nl",
  ru: "ru", uk: "uk", pl: "pl", tr: "tr", el: "el", sv: "sv", da: "da",
  no: "nb", fi: "fi", ro: "ro", cs: "cs", ar: "ar", fa: "fa", he: "he",
  hi: "hi", ur: "ur", bn: "bn", "zh-CN": "zh-Hans", "zh-TW": "zh-Hant",
  ja: "ja", ko: "ko", id: "id", ms: "ms", vi: "vi", th: "th", hu: "hu",
  bg: "bg", hr: "hr", sr: "sr", sk: "sk", ca: "ca", fil: "fil"
};

const DEEPL_CODES = {
  af: "AF", ha: "HA", ig: "IG", ln: "LN", sw: "SW", xh: "XH", zu: "ZU",
  ar: "AR", bg: "BG", bn: "BN", ca: "CA", cs: "CS", da: "DA", de: "DE",
  el: "EL", es: "ES", fi: "FI", fr: "FR", he: "HE", hi: "HI", hu: "HU",
  id: "ID", it: "IT", ja: "JA", ko: "KO", nl: "NL", no: "NB", pl: "PL",
  pt: "PT-PT", ro: "RO", ru: "RU", sk: "SK", sv: "SV", tr: "TR",
  uk: "UK", vi: "VI", zh: "ZH"
};

const requireResponse = async (response, provider) => {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${provider} returned HTTP ${response.status}: ${detail.slice(0, 240)}`);
  }
  return response.json();
};

const getAzureLanguages = async () => {
  if (!azureKey) return new Set();
  const headers = { "Ocp-Apim-Subscription-Key": azureKey };
  if (azureRegion) headers["Ocp-Apim-Subscription-Region"] = azureRegion;
  const response = await fetch(`${azureEndpoint}/languages?api-version=3.0&scope=translation`, { headers });
  const data = await requireResponse(response, "Azure language discovery");
  return new Set(Object.keys(data.translation || {}));
};

const chunks = (items, maxItems = 20, maxCharacters = 4200) => {
  const result = [];
  let batch = [];
  let size = 0;
  for (const item of items) {
    const length = item.text.length;
    if (batch.length && (batch.length >= maxItems || size + length > maxCharacters)) {
      result.push(batch);
      batch = [];
      size = 0;
    }
    batch.push(item);
    size += length;
  }
  if (batch.length) result.push(batch);
  return result;
};

const translateAzure = async (texts, target) => {
  const headers = {
    "Ocp-Apim-Subscription-Key": azureKey,
    "Content-Type": "application/json; charset=UTF-8"
  };
  if (azureRegion) headers["Ocp-Apim-Subscription-Region"] = azureRegion;
  const url = new URL(`${azureEndpoint}/translate`);
  url.searchParams.set("api-version", "3.0");
  url.searchParams.set("from", "en");
  url.searchParams.set("to", target);
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(texts.map(({ text }) => ({ Text: text })))
  });
  const payload = await requireResponse(response, "Azure Translator");
  return payload.map((item) => item?.translations?.[0]?.text);
};

const translateDeepL = async (texts, target) => {
  const response = await fetch(`${deeplEndpoint}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${deeplKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: texts.map(({ text }) => text),
      source_lang: "EN",
      target_lang: target,
      preserve_formatting: true
    })
  });
  const payload = await requireResponse(response, "DeepL");
  return payload.translations?.map((item) => item.text);
};

const flatten = (value, prefix = "", output = []) => {
  if (typeof value === "string") {
    output.push({ key: prefix, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, prefix ? `${prefix}.${index}` : String(index), output));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      flatten(item, prefix ? `${prefix}.${key}` : key, output)
    );
  }
  return output;
};

const assign = (target, dottedKey, value) => {
  const parts = dottedKey.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    const next = parts[parts.indexOf(part) + 1];
    cursor = cursor[part] ??= /^\d+$/.test(next) ? [] : {};
  }
  cursor[parts.at(-1)] = value;
};

const sources = await Promise.all(
  (await (await import("node:fs/promises")).readdir(sourceDir))
    .filter((name) => name.endsWith(".json"))
    .map(async (name) => [name, JSON.parse(await readFile(path.join(sourceDir, name), "utf8"))])
);

if (!azureKey && !deeplKey) {
  console.error("No translation provider configured. Set AZURE_TRANSLATOR_KEY and/or DEEPL_AUTH_KEY.");
  process.exit(1);
}

const azureLanguages = await getAzureLanguages().catch((error) => {
  console.warn(`Azure language discovery failed; DeepL fallback will be used where available: ${error.message}`);
  return new Set();
});

const report = { generated: [DEFAULT_LANGUAGE], providers: {}, unsupportedOrFailed: [] };
for (const language of LANGUAGES.filter((item) => item.code !== DEFAULT_LANGUAGE)) {
  const azureCode = AZURE_CODES[language.code];
  const deeplCode = DEEPL_CODES[language.code];
  const useAzure = Boolean(azureKey && azureCode && azureLanguages.has(azureCode));
  const useDeepL = Boolean(deeplKey && deeplCode);
  if (!useAzure && !useDeepL) {
    report.unsupportedOrFailed.push({ code: language.code, reason: "Not supported by configured translation providers." });
    continue;
  }

  try {
    const translatedFiles = [];
    let providerUsed = useAzure ? "Azure Translator" : "DeepL";
    for (const [name, source] of sources) {
      const entries = flatten(source);
      const translated = {};
      for (const batch of chunks(entries)) {
        let values;
        if (useAzure) {
          try {
            values = await translateAzure(batch, azureCode);
          } catch (error) {
            if (!useDeepL) throw error;
            console.warn(`Azure failed for ${language.code}; using DeepL for this batch: ${error.message}`);
            values = await translateDeepL(batch, deeplCode);
            providerUsed = "Azure + DeepL fallback";
          }
        } else {
          values = await translateDeepL(batch, deeplCode);
        }
        if (!Array.isArray(values) || values.length !== batch.length || values.some((item) => typeof item !== "string")) {
          throw new Error("Provider returned an incomplete translation batch.");
        }
        batch.forEach((entry, index) => assign(translated, entry.key, values[index]));
      }
      translatedFiles.push([name, translated]);
    }

    const targetDir = path.join(outputDir, language.code);
    await mkdir(targetDir, { recursive: true });
    await Promise.all(translatedFiles.map(([name, content]) =>
      writeFile(path.join(targetDir, name), JSON.stringify(content, null, 2) + "\n", "utf8")
    ));
    report.generated.push(language.code);
    report.providers[language.code] = providerUsed;
    console.log(`Generated ${language.code} (${language.name}) via ${providerUsed}`);
  } catch (error) {
    report.unsupportedOrFailed.push({ code: language.code, reason: error.message });
    console.warn(`Skipped ${language.code} (${language.name}): ${error.message}`);
  }
}

await writeFile(
  path.join(root, "src/i18n/generatedLanguages.js"),
  `export const GENERATED_LANGUAGES = ${JSON.stringify([...new Set(report.generated)])};\n`,
  "utf8"
);
console.log(JSON.stringify(report, null, 2));
if (report.generated.length <= 1) process.exitCode = 1;
