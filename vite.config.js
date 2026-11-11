import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const pwaManifest = {
  id: "/",
  name: "Garden of Mercy Foundation",
  short_name: "Garden of Mercy",
  description:
    "Sowing seeds of mercy and compassion by supporting vulnerable children, restoring dignity, and strengthening communities.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  display_override: ["standalone", "minimal-ui"],
  orientation: "portrait-primary",
  background_color: "#ffffff",
  theme_color: "#176b45",
  categories: ["nonprofit", "education", "social"],
  prefer_related_applications: false,
  icons: [
    { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
    { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" }
  ]
};

const buildId =
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  new Date().toISOString();

export default defineConfig({
  publicDir: "public",
  define: {
    __GOM_BUILD_ID__: JSON.stringify(buildId)
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "prompt",
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,json}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      },
      manifest: pwaManifest
    })
  ]
});
