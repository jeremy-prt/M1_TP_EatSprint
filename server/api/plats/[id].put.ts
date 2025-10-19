import type { Plat } from '~/types/plat'
import type { Restaurant } from '~/types/restaurant'
import type { User } from '~/types/auth'

interface UpdatePlatRequest {
  nom?: string
  prix?: number
  description?: string
  categorie?: string
  calories?: number
  temps_preparation_min?: number
  vegetarien?: boolean
  vegan?: boolean
  epice?: boolean
  allergenes?: string | null
  disponible?: boolean
  image?: string
}

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

  const platId = getRouterParam(event, 'id')
  const body = await readBody<UpdatePlatRequest>(event)

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

    // Récupérer le plat pour vérifier le restaurant_id
    const platCheck = await $fetch<Plat[]>(`${config.supabaseUrl}/rest/v1/plats`, {
      method: 'GET',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json'
      },
      query: {
        id: `eq.${platId}`,
        select: '*'
      },
      timeout: 10000
    })

    if (!Array.isArray(platCheck) || platCheck.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Plat non trouvé'
      })
    }

    const plat = platCheck[0]

    // Vérifier que le restaurant du plat appartient à l'user
    const restaurantCheck = await $fetch<Restaurant[]>(`${config.supabaseUrl}/rest/v1/restaurants`, {
      method: 'GET',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json'
      },
      query: {
        id: `eq.${plat.restaurant_id}`,
        owner_id: `eq.${userId}`,
        select: '*'
      },
      timeout: 10000
    })

    if (!Array.isArray(restaurantCheck) || restaurantCheck.length === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Vous ne pouvez pas modifier ce plat'
      })
    }

    // Mettre à jour le plat
    const response = await $fetch<Plat[]>(`${config.supabaseUrl}/rest/v1/plats`, {
      method: 'PATCH',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      query: {
        id: `eq.${platId}`
      },
      body,
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
    console.error('Erreur lors de la mise à jour du plat:', {
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

    // Plat non trouvé
    if (error.statusCode === 404) {
      throw error
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la mise à jour du plat'
    })
  }
})
