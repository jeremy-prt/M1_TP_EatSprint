import type { Restaurant } from '~/types/restaurant'
import type { User } from '~/types/auth'
import type { UpdateRestaurantOwnerRequest } from '~/types/requests'

/**
 * PUT /api/restaurants/:id
 * Met à jour les informations d'un restaurant (propriétaire uniquement)
 * @requires Cookie auth_user_id - Utilisateur doit être le propriétaire du restaurant
 * @param id - ID du restaurant à modifier
 * @body UpdateRestaurantOwnerRequest - Données à mettre à jour (champs optionnels)
 * @returns { restaurant: Restaurant } - Restaurant mis à jour
 * @throws 401 - Non authentifié
 * @throws 403 - Accès interdit (non restaurant_owner ou pas le propriétaire)
 * @throws 404 - Restaurant non trouvé
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

  const restaurantId = getRouterParam(event, 'id')
  const body = await readBody<UpdateRestaurantOwnerRequest>(event)

  try {
    // Vérifier que l'utilisateur est un restaurant_owner
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

    if (!Array.isArray(userCheck) || userCheck.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    const user = userCheck[0]

    if (user.role !== 'restaurant_owner') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès interdit : droits restaurateur requis'
      })
    }

    // Vérifier que le restaurant appartient bien à cet utilisateur
    const restaurantCheck = await $fetch<Restaurant[]>(
      `${config.supabaseUrl}/rest/v1/restaurants`,
      {
        method: 'GET',
        headers: {
          apikey: config.supabaseKey,
          Authorization: `Bearer ${config.supabaseKey}`,
          'Content-Type': 'application/json'
        },
        query: {
          id: `eq.${restaurantId}`,
          select: '*'
        },
        timeout: 10000
      }
    )

    if (!Array.isArray(restaurantCheck) || restaurantCheck.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Restaurant non trouvé'
      })
    }

    if (restaurantCheck[0].owner_id !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Vous ne pouvez modifier que vos propres restaurants'
      })
    }

    // Préparer les données de mise à jour (filtre les champs undefined)
    const updateData: any = {}
    if (body.nom !== undefined) updateData.nom = body.nom
    if (body.adresse !== undefined) updateData.adresse = body.adresse
    if (body.ville !== undefined) updateData.ville = body.ville
    if (body.categorie !== undefined) updateData.categorie = body.categorie
    if (body.image !== undefined) updateData.image = body.image
    if (body.cuisine !== undefined) updateData.cuisine = body.cuisine
    if (body.gamme_prix !== undefined) updateData.gamme_prix = body.gamme_prix
    if (body.temps_livraison_min !== undefined) updateData.temps_livraison_min = body.temps_livraison_min

    // Mettre à jour le restaurant
    const response = await $fetch<Restaurant[]>(
      `${config.supabaseUrl}/rest/v1/restaurants`,
      {
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
        body: updateData,
        timeout: 10000
      }
    )

    if (!Array.isArray(response) || response.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la mise à jour'
      })
    }

    return { restaurant: response[0] }
  } catch (error: any) {
    console.error('Erreur lors de la modification du restaurant:', {
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

    if (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la modification du restaurant'
    })
  }
})
