import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import enCommon from "./locales/en/common.json";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  getAvailableLanguages
} from "./languageConfig.js";

const availableLanguages = getAvailableLanguages();
const supportedLngs = LANGUAGES.map(({ code }) => code);
const availableLanguageCodes = new Set(availableLanguages.map(({ code }) => code));
let initialLanguage = DEFAULT_LANGUAGE;

try {
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (availableLanguageCodes.has(savedLanguage)) initialLanguage = savedLanguage;
} catch {
  // Storage may be unavailable in private browsing or restricted contexts.
}

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    resources: { en: { common: enCommon } },
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs,
    defaultNS: "common",
    ns: ["common"],
    load: "currentOnly",
    partialBundledLanguages: true,
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false }
  });

i18n.on("languageChanged", (language) => {
  const selected = LANGUAGES.find((item) => item.code === language);
  document.documentElement.lang = language;
  document.documentElement.dir = selected?.direction || "ltr";
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Keep the in-memory language selection when storage is unavailable.
  }
});

document.documentElement.lang = initialLanguage;
document.documentElement.dir =
  LANGUAGES.find((item) => item.code === initialLanguage)?.direction || "ltr";

export default i18n;
