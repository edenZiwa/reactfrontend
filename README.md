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
- `src/pages/` — Home, About, Programs, Impact, Gallery, Founder, Donate, Donation Result, Contact, Sponsor, Account, Privacy, Terms and fallback page
- `src/services/` — donation API wrapper and form validation
- `src/css/` — responsive styling for the React pages
- `public/` — static images and video assets used by the site (must be included in the project archive/deployment).



## Multilingual support

The application uses i18next and react-i18next. The searchable language catalogue is maintained in `src/i18n/languageConfig.js`; English is the default and fallback language. Generated locale resources are loaded on demand from `/locales/{language}/{namespace}.json` and included in the PWA precache.

### Machine translation generation

The production build runs `scripts/build.js`. When `GOOGLE_TRANSLATE_API_KEY` is present in the build environment, it runs `scripts/generate-translations.js` before Vite. Without the key, the build uses the locale resources already committed to the repository and English fallback.

Configure `GOOGLE_TRANSLATE_API_KEY` as a **Cloudflare Pages build environment secret** (and as a GitHub Actions repository secret if translations should also be generated in CI). Never use a `VITE_`-prefixed variable for this credential. The translation provider may not support every listed Ugandan or African language; unsupported targets remain unavailable rather than being presented as translated.

Only language resources listed in `src/i18n/generatedLanguages.js` are enabled in the selector. Machine-generated content should be checked for meaning and formatting before it is relied on for sensitive legal, safeguarding, medical, financial or donation instructions.
