import type { User } from '~/types/auth'
import type { UpdateUserRequest } from '~/types/requests'

/**
 * PUT /api/admin/users/:id
 * Met à jour les informations d'un utilisateur (admin uniquement)
 * @requires Cookie auth_user_id - Utilisateur doit être admin
 * @param id - ID de l'utilisateur à modifier
 * @body UpdateUserRequest - Données à mettre à jour (champs optionnels)
 * @returns { user: User } - Utilisateur mis à jour
 * @throws 401 - Non authentifié
 * @throws 403 - Accès interdit (non admin)
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
  const body = await readBody<UpdateUserRequest>(event)

  try {
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

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.adresse !== undefined) updateData.adresse = body.adresse
    if (body.ville !== undefined) updateData.ville = body.ville
    if (body.code_postal !== undefined) updateData.code_postal = body.code_postal

    const response = await $fetch<User[]>(`${config.supabaseUrl}/rest/v1/users`, {
      method: 'PATCH',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      query: {
        id: `eq.${targetUserId}`
      },
      body: updateData,
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

    return { user: response[0] }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', {
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

    if (error.statusCode === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cet email est déjà utilisé'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la mise à jour de l\'utilisateur'
    })
  }
})
