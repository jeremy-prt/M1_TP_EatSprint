import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt"
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseKey: process.env.NUXT_SUPABASE_KEY,
  },
  routeRules: {
    '/auth/login': { ssr: false },
    '/auth/register': { ssr: false },
    '/mon-espace-perso': { ssr: false },
    '/panier': { ssr: false },
    '/commandes': { ssr: false },
    '/admin/**': { ssr: false },
    '/dashboard/**': { ssr: false }
  }
});