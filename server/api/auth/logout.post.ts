export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_user_id')

  return { success: true }
})
