# Google Play release preparation

This project will be published as a Trusted Web Activity (TWA) that loads the existing
Garden of Mercy Foundation PWA at https://gardenofmercy.org/.

## Hosting boundaries

- Web frontend and PWA: Cloudflare Pages (gardenofmercy.org)
- API: Render (api.gardenofmercy.org)
- Public media: Cloudflare R2 (media.gardenofmercy.org)

The Android wrapper must not move or duplicate these services.

## Proposed Android identity

- Display name: Garden of Mercy Foundation
- Proposed application ID: org.gardenofmercy.app
- Start URL: https://gardenofmercy.org/
- Scope/origin: https://gardenofmercy.org/

The application ID is a proposal and must be checked in Play Console before the first
release. Once published, an Android application ID cannot be changed for updates.

## Current PWA integration found in the frontend

- Vite PWA plugin is configured with `injectManifest`.
- The service worker is at `src/sw.js`.
- The web manifest is `public/manifest.webmanifest`.
- The app already has a PWA install/update provider.
- The web manifest currently references SVG launcher icons. Before Android packaging,
  add and verify raster PNG icons at 192x192 and 512x512, including a 512x512
  maskable icon with safe-zone padding. Keep SVG icons for browser use if desired.

## Release steps

1. Deploy the PWA manifest and production icon assets to the canonical HTTPS origin.
2. Validate the production manifest, service worker, navigation scope, offline behavior,
   login, donation checkout return flow, and external links on Android Chrome.
3. Initialize the TWA project from the production manifest with Bubblewrap.
4. Set the final application ID and app metadata; build a release Android App Bundle.
5. Enroll in Play App Signing and retain the upload key securely outside source control.
6. Publish the Play App Signing SHA-256 certificate fingerprint in
   `https://gardenofmercy.org/.well-known/assetlinks.json`.
   Do not publish a guessed fingerprint or commit private signing keys.
7. Verify Digital Asset Links and confirm the app opens as a verified TWA without
   browser chrome. A failed verification can cause a Custom Tab fallback.
8. Complete Play Console store listing, privacy/data-safety declarations, content
   rating, app access instructions, screenshots, and policy declarations.
9. Test the signed bundle through an internal Play testing track before production.

## Google Play target API

At the time this preparation was written (10 November 2026), new apps and updates
submitted from 31 August 2026 must target Android 16 (API 36) or higher. Re-check
the current Play Console requirement immediately before uploading.

## Secrets and ownership

Never commit keystores, passwords, Play service-account credentials, or private
signing material. The Digital Asset Links file contains public certificate
fingerprints only. Keep the upload key and Play Console access under foundation
ownership with documented recovery access.

## Release blockers

- Confirm the final package ID in Play Console.
- Supply production-ready PNG launcher icons (192, 512, and maskable 512).
- Generate the TWA signing certificate and configure the matching Digital Asset Links file.
- Confirm the Play Console developer account and complete policy/store listing assets.
