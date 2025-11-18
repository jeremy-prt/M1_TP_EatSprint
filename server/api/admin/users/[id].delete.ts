import type { User } from '~/types/auth'

/**
 * DELETE /api/admin/users/:id
 * Supprime un utilisateur (admin uniquement)
 * @requires Cookie auth_user_id - Utilisateur doit être admin
 * @param id - ID de l'utilisateur à supprimer
 * @returns { success: true } - Confirmation de suppression
 * @throws 401 - Non authentifié
 * @throws 403 - Accès interdit (non admin ou tentative de se supprimer soi-même)
 * @throws 404 - Utilisateur non trouvé
 * @throws 500 - Erreur serveur ou configuration manquante
 * @throws 503 - Service temporairement indisponible
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Configuration Supabase manquante')
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration du serveur incomplète'
    })
  }

  const userId = getCookie(event, 'auth_user_id')
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié'
    })
  }

  const targetUserId = getRouterParam(event, 'id')

  // Empêcher un admin de se supprimer lui-même
  if (userId === targetUserId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Vous ne pouvez pas supprimer votre propre compte'
    })
  }

  try {
    // Vérifier que l'utilisateur connecté est admin
    const userCheck = await $fetch<User[]>(`${config.supabaseUrl}/rest/v1/users`, {
      method: 'GET',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json'
      },
      query: {
        id: `eq.${userId}`,
        select: '*'
      },
      timeout: 10000
    })

    if (!Array.isArray(userCheck) || userCheck.length === 0 || userCheck[0].role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès interdit : droits administrateur requis'
      })
    }

    // Supprimer l'utilisateur
    const response = await $fetch<User[]>(`${config.supabaseUrl}/rest/v1/users`, {
      method: 'DELETE',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      query: {
        id: `eq.${targetUserId}`
      },
      timeout: 10000
    })

    if (!Array.isArray(response)) {
      console.error('Format de réponse invalide:', response)
      throw createError({
        statusCode: 500,
        statusMessage: 'Format de données invalide'
      })
    }

    if (response.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    })

    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service temporairement indisponible'
      })
    }

    if (error.statusCode === 401 || error.statusCode === 403) {
      throw error
    }

    if (error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la suppression de l\'utilisateur'
    })
  }
})
