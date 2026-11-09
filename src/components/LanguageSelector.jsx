import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LANGUAGE_GROUPS
} from "../i18n/languageConfig.js";

export default function LanguageSelector() {
  const { i18n, t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectorRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!selectorRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const activeLanguage =
    LANGUAGES.find((language) => language.code === i18n.resolvedLanguage) ||
    LANGUAGES.find((language) => language.code === DEFAULT_LANGUAGE);

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return LANGUAGES.filter((language) => {
      if (!normalizedQuery) return true;
      return [
        language.name,
        language.nativeName,
        language.code,
        language.group
      ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
    });
  }, [query]);

  const selectLanguage = async (language) => {
    if (!language.ready) return;
    await i18n.changeLanguage(language.code);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="gom-language-selector dropdown" ref={selectorRef}>
      <button
        className="gom-language-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("language")}
        onClick={() => setOpen((value) => !value)}
      >
        <i className="bi bi-globe2" aria-hidden="true" />
        <span>{activeLanguage?.nativeName || "English"}</span>
        <i className={`bi bi-chevron-down gom-language-chevron${open ? " is-open" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="gom-language-menu" role="dialog" aria-label={t("chooseLanguage")}>
          <div className="gom-language-menu-heading">
            <strong>{t("chooseLanguage")}</strong>
            <button
              type="button"
              className="gom-language-close"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>

          <label className="gom-language-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchLanguages")}
              aria-label={t("searchLanguages")}
              autoComplete="off"
            />
          </label>

          <div className="gom-language-list">
            {LANGUAGE_GROUPS.map((group) => {
              const items = filteredLanguages.filter((language) => language.group === group);
              if (!items.length) return null;
              return (
                <section className="gom-language-group" key={group}>
                  <h3>{group}</h3>
                  {items.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      className={[
                        "gom-language-option",
                        language.code === activeLanguage?.code ? "is-active" : "",
                        !language.ready ? "is-pending" : ""
                      ].filter(Boolean).join(" ")}
                      onClick={() => selectLanguage(language)}
                      disabled={!language.ready}
                      aria-current={language.code === activeLanguage?.code ? "true" : undefined}
                      title={!language.ready ? t("translationInPreparation") : language.name}
                    >
                      <span className="gom-language-option-copy">
                        <span className="gom-language-native">{language.nativeName}</span>
                        <span className="gom-language-name">{language.name}</span>
                      </span>
                      {language.ready ? (
                        <i className="bi bi-check2" aria-hidden="true" />
                      ) : (
                        <span className="gom-language-pending" aria-label={t("translationInPreparation")}>
                          <i className="bi bi-hourglass-split" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  ))}
                </section>
              );
            })}
            {filteredLanguages.length === 0 && (
              <p className="gom-language-empty">{t("noLanguagesFound")}</p>
            )}
          </div>
          <p className="gom-language-footnote">{t("translationInPreparation")}</p>
        </div>
      )}
    </div>
  );
}
