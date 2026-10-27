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

