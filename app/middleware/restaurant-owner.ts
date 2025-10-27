/**
 * Middleware d'autorisation propriétaire de restaurant
 * Vérifie que l'utilisateur est authentifié et possède le rôle restaurant_owner
 * Redirige vers /auth/login si non authentifié, ou vers / si non propriétaire
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authStore.isRestaurantOwner) {
    return navigateTo('/')
  }
})
