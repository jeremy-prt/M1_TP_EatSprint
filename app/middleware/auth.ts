/**
 * Middleware d'authentification
 * Vérifie que l'utilisateur est authentifié avant d'accéder à la route
 * Redirige vers /auth/login si non authentifié
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
