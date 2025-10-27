import type { Plat } from '~/types/plat'
import type { Restaurant } from '~/types/restaurant'
import type { User } from '~/types/auth'
import type { CreatePlatRequest } from '~/types/requests'

/**
 * POST /api/restaurants/:id/plats
 * Crée un nouveau plat pour un restaurant (propriétaire uniquement)
 * @requires Cookie auth_user_id - Utilisateur doit être le propriétaire du restaurant
 * @param id - ID du restaurant parent
 * @body CreatePlatRequest - Données du plat à créer
 * @returns { plat: Plat } - Plat créé
 * @throws 401 - Non authentifié
 * @throws 403 - Accès interdit (non restaurant_owner ou pas le propriétaire)
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

  // Vérifier que l'user est connecté
  const userId = getCookie(event, 'auth_user_id')
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié'
    })
  }

  const restaurantId = getRouterParam(event, 'id')
  const body = await readBody<CreatePlatRequest>(event)

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

    if (!Array.isArray(userCheck) || userCheck.length === 0 || userCheck[0].role !== 'restaurant_owner') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès interdit : droits restaurateur requis'
      })
    }

    // Vérifier que le restaurant appartient à l'user
    const restaurantCheck = await $fetch<Restaurant[]>(`${config.supabaseUrl}/rest/v1/restaurants`, {
      method: 'GET',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json'
      },
      query: {
        id: `eq.${restaurantId}`,
        owner_id: `eq.${userId}`,
        select: '*'
      },
      timeout: 10000
    })

    if (!Array.isArray(restaurantCheck) || restaurantCheck.length === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Vous ne pouvez pas ajouter de plats à ce restaurant'
      })
    }

    // Générer le slug à partir du nom
    const slug = generateSlug(body.nom)

    // Créer le plat
    const response = await $fetch<Plat[]>(`${config.supabaseUrl}/rest/v1/plats`, {
      method: 'POST',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: {
        ...body,
        slug,
        restaurant_id: parseInt(restaurantId!)
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

    return { plat: response[0] }
  } catch (error: any) {
    console.error('Erreur lors de la création du plat:', {
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

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la création du plat'
    })
  }
})
