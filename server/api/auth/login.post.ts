import type { LoginRequest, User } from '~/types/auth'

/**
 * POST /api/auth/login
 * Authentifie un utilisateur avec email et mot de passe
 * @returns { user: User } - Utilisateur authentifié avec cookie de session
 * @throws 401 - Email ou mot de passe incorrect
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

  const body = await readBody<LoginRequest>(event)

  try {
    const response = await $fetch<User[]>(`${config.supabaseUrl}/rest/v1/users`, {
      method: 'GET',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json'
      },
      query: {
        email: `eq.${body.email}`,
        password: `eq.${body.password}`,
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
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    const user = response[0]

    setCookie(event, 'auth_user_id', String(user.id), {
      httpOnly: true,
      secure: !import.meta.dev,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })

    return { user }
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', {
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

    // Credentials invalides
    if (error.statusCode === 401) {
      throw error
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la connexion'
    })
  }
})
