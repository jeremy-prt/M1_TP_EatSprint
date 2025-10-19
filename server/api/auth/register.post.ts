import type { RegisterRequest, User } from '~/types/auth'

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

  const body = await readBody<RegisterRequest>(event)

  try {
    const response = await $fetch<User[]>(`${config.supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
        adresse: body.adresse || null,
        ville: body.ville || null,
        code_postal: body.code_postal || null,
        role: 'customer'
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

    const user = response[0]

    setCookie(event, 'auth_user_id', String(user.id), {
      httpOnly: true,
      secure: !import.meta.dev,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })

    return { user }
  } catch (error: any) {
    console.error('Erreur lors de la création du compte:', {
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

    // Email déjà utilisé
    if (error.statusCode === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cet email est déjà utilisé'
      })
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la création du compte'
    })
  }
})
