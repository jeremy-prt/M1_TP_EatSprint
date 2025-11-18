/**
 * Middleware d'autorisation propriétaire de restaurant
 * Vérifie que l'utilisateur est authentifié et possède le rôle restaurant_owner
 * Redirige vers /auth/login si non authentifié, ou vers / si non propriétaire
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

  if (!authStore.isRestaurantOwner) {
    return navigateTo('/')
  }
})
