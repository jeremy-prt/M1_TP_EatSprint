/**
 * POST /api/auth/logout
 * Déconnecte l'utilisateur en supprimant le cookie de session
 * @returns { success: true }
 */
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_user_id')

  return { success: true }
})
