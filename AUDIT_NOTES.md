# Frontend audit notes

## Fixes applied
## Image path fixes
- Moved all 24 image assets into `public/images/`, matching the frontend’s `/images/...` URLs so images resolve consistently from nested routes and production builds.
- Updated CSS background-image references for `main.png` to use `/images/main.png`.
- Corrected the header logo path from the route-relative `../images/logo.png` to `/images/logo.png`.

- Removed the duplicate `export default Home` declaration that prevented the Home module from compiling.
- Made donation status descriptions return the structured `{ tone, title, message }` object consumed by `DonationResult.jsx` (the previous string return caused invalid status rendering).
- Made the Account page use the same configurable `VITE_API_BASE_URL` as donation requests.
- Normalized client-side paths and made navigation handle same-origin URLs, query strings, hashes, and external destinations consistently.
- Corrected internal route targets that pointed at legacy `.html` pages or inconsistent relative paths.
- Corrected the Success Stories page title and improved the not-found page with a working home link.

## Remaining blockers to resolve before production
- The uploaded archive does **not** include a `public/` directory. The app references `/images/...` and `/videos/...`; these assets will return 404 until the original media is restored to `public/images/` and `public/videos/`.
- A production build could not be run in this environment because the archive has no complete installed dependencies and npm package downloads were unavailable. Run `npm install` and `npm run build` in an environment with npm registry access.
- Donation checkout/status, account, sponsorship, and logout flows depend on backend endpoints. The frontend cannot verify these flows without the matching backend and provider configuration.
- The contact form intentionally reports that it has not sent the message until a contact backend endpoint is connected.
- Account sign-in is not implemented in the supplied frontend; the account page should not be advertised as a working authentication flow until auth is configured.
