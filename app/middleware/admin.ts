/**
 * Middleware d'autorisation administrateur
 * Vérifie que l'utilisateur est authentifié et possède le rôle admin
 * Redirige vers /auth/login si non authentifié, ou vers / si non admin
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
})
