import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@vite-pwa/nuxt",
  ],
  image: {
    formats: ["webp", "avif", "jpeg", "png"],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  i18n: {
    defaultLocale: "fr",
    strategy: "no_prefix",
    locales: [
      { code: "fr", name: "Français", file: "fr.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "EatSprint - Livraison de repas",
      short_name: "EatSprint",
      description:
        "Découvrez et commandez vos plats préférés chez les meilleurs restaurants",
      theme_color: "#f97316",
      background_color: "#fef9f7",
      display: "standalone",
      orientation: "portrait",
      start_url: "/",
      lang: "fr",
      icons: [
        {
          src: "/pwa-icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      cleanupOutdatedCaches: true,
      globPatterns: ["**/*.{js,css,html,svg,ico,webp,avif}"],
      globIgnores: ["**/screenshot-*.png", "**/screenshot-*.jpg"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      type: "module",
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      process.env.ANALYZE === "true"
        ? visualizer({
            open: true,
            filename: "stats.html",
            gzipSize: true,
            brotliSize: true,
          })
        : undefined,
    ].filter(Boolean),
  },
  nitro: {
    prerender: {
      routes: ["/"],
    },
  },
  runtimeConfig: {
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseKey: process.env.NUXT_SUPABASE_KEY,
  },
  routeRules: {
    "/auth/login": { ssr: false },
    "/auth/register": { ssr: false },
    "/mon-espace-perso": { ssr: false },
    "/panier": { ssr: false },
    "/commandes": { ssr: false },
    "/admin/**": { ssr: false },
    "/dashboard/**": { ssr: false },
  },
});
