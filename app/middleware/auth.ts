/**
 * Middleware d'authentification
 * Vérifie que l'utilisateur est authentifié avant d'accéder à la route
 * Redirige vers /auth/login si non authentifié
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Si pas authentifié côté store, vérifier la session serveur
  if (!authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
    } catch {
      return navigateTo('/auth/login')
    }
  }
})
