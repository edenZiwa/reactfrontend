import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES
} from "./languageConfig.js";

const supportedLngs = LANGUAGES.map(({ code }) => code);

let initialLanguage = DEFAULT_LANGUAGE;
try {
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (supportedLngs.includes(savedLanguage)) initialLanguage = savedLanguage;
} catch {
  // Storage may be unavailable in private browsing or restricted contexts.
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon }
    },
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs,
    defaultNS: "common",
    ns: ["common"],
    load: "currentOnly",
    interpolation: { escapeValue: false },
    returnNull: false,
    initImmediate: false
  });

i18n.on("languageChanged", (language) => {
  const selected = LANGUAGES.find((item) => item.code === language);
  const direction = selected?.direction || "ltr";
  document.documentElement.lang = language;
  document.documentElement.dir = direction;
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
