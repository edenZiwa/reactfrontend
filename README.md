# Garden of Mercy Foundation — React app

The React application has been organized into reusable site components, individual pages, and service helpers while retaining the supplied `public/` assets.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create a production build in `dist/`.

## Structure

- `src/App.jsx` — route selection and shared app shell
- `src/components/SiteChrome.jsx` — navigation, footer, shared links, page headings and CTA
- `src/components/usePath.js` — lightweight client-side navigation
- `src/pages/` — public pages, member account and administration
- `src/services/` — donation API wrapper and form validation
- `src/css/` — responsive styling
- `public/` — static images, videos and generated locale resources.

## Multilingual support

The application uses i18next and react-i18next. The searchable language catalogue is maintained in `src/i18n/languageConfig.js`; English is the default and fallback language. Generated locale resources are loaded from `/locales/{language}/{namespace}.json` and included in the PWA precache.

### Azure Translator + DeepL build-time generation

The production build runs `scripts/build.js`. If translation credentials are present, it runs `scripts/generate-translations.js` before Vite. Azure Translator is the primary provider; DeepL is used for languages Azure does not list or for Azure batch failures, when DeepL supports that target. Generated JSON files are saved in `public/locales/{language}/`, and `src/i18n/generatedLanguages.js` is refreshed so the selector only enables languages with generated resources.

Configure these as **Cloudflare Pages build environment secrets** (and as GitHub Actions repository secrets if translations should also be generated in CI):

- `AZURE_TRANSLATOR_KEY` — Azure Translator resource key.
- `AZURE_TRANSLATOR_REGION` — required for regional or multi-service Azure resources; omit for a global Translator resource.
- `AZURE_TRANSLATOR_ENDPOINT` — optional; defaults to `https://api.cognitive.microsofttranslator.com`.
- `DEEPL_AUTH_KEY` — optional DeepL API key used as fallback.
- `DEEPL_API_URL` — optional; defaults to `https://api-free.deepl.com`. Use `https://api.deepl.com` for a DeepL Pro API account.

Never use `VITE_`-prefixed variables for provider credentials. Do not commit keys to the repository. The build can still run without credentials, using committed locale files and English fallback.

Only provider-supported targets with successfully generated JSON resources become selectable. Many local Ugandan languages in the catalogue are not supported by these machine translation providers; they remain disabled rather than being falsely represented as translated. Machine-generated content must be reviewed before use in legal, safeguarding, medical, financial or donation instructions.
