import type { User } from '~/types/auth'

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

  const userId = getCookie(event, 'auth_user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié'
    })
  }

  try {
    const response = await $fetch<User[]>(`${config.supabaseUrl}/rest/v1/users`, {
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

    // Vérification que la réponse est bien un tableau
    if (!Array.isArray(response)) {
      console.error('Format de réponse invalide:', response)
      throw createError({
        statusCode: 500,
        statusMessage: 'Format de données invalide'
      })
    }

    if (response.length === 0) {
      deleteCookie(event, 'auth_user_id')
      throw createError({
        statusCode: 401,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    return { user: response[0] }
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', {
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
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur d\'authentification avec la base de données'
      })
    }

    // User non trouvé (déjà géré)
    if (error.statusCode === 401) {
      throw error
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la récupération de l\'utilisateur'
    })
  }
})
