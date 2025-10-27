import type { Restaurant } from '~/types/restaurant'
import type { User } from '~/types/auth'
import type { UpdateRestaurantAdminRequest } from '~/types/requests'

/**
 * PUT /api/admin/restaurants/:id
 * Assigne ou désassigne un propriétaire à un restaurant (admin uniquement)
 * @requires Cookie auth_user_id - Utilisateur doit être admin
 * @param id - ID du restaurant à modifier
 * @body UpdateRestaurantAdminRequest - { owner_id: number | null }
 * @returns { restaurant: Restaurant } - Restaurant mis à jour
 * @throws 401 - Non authentifié
 * @throws 403 - Accès interdit (non admin) ou owner_id invalide
 * @throws 404 - Restaurant non trouvé
 * @throws 500 - Erreur serveur ou configuration manquante
 * @throws 503 - Service temporairement indisponible
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Vérification des variables d'environnement
  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Configuration Supabase manquante')
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration du serveur incomplète'
    })
  }

  // Vérifier que l'user est admin
  const userId = getCookie(event, 'auth_user_id')
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié'
    })
  }

  const restaurantId = getRouterParam(event, 'id')
  const body = await readBody<UpdateRestaurantAdminRequest>(event)

  try {
    // Vérifier le role de l'user
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

    // Mettre à jour le restaurant
    const response = await $fetch<Restaurant[]>(`${config.supabaseUrl}/rest/v1/restaurants`, {
      method: 'PATCH',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      query: {
        id: `eq.${restaurantId}`
      },
      body: {
        owner_id: body.owner_id
      },
      timeout: 10000
    })

    // Vérification que la réponse est bien un tableau
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
        statusMessage: 'Restaurant non trouvé'
      })
    }

    return { restaurant: response[0] }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du restaurant:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    })

    // Erreur réseau ou timeout
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service temporairement indisponible'
      })
    }

    // Erreur d'authentification
    if (error.statusCode === 401 || error.statusCode === 403) {
      throw error
    }

    // Restaurant non trouvé
    if (error.statusCode === 404) {
      throw error
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la mise à jour du restaurant'
    })
  }
})
