import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    publicDir: "public",
    VitePWA({
      strategies: "injectManifest",

      srcDir: "src",
      filename: "sw.js",

      registerType: "prompt",

      injectManifest: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,woff2}"
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      },

      manifest: {
        id: "/",
        name: "Garden of Mercy Foundation",
        short_name: "Garden of Mercy",
        description:
          "Sowing seeds of mercy and compassion by supporting vulnerable children, restoring dignity, and strengthening communities.",

        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",

        background_color: "#ffffff",
        theme_color: "#176b45",

        categories: [
          "nonprofit",
          "education",
          "social"
        ],

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ]
});
