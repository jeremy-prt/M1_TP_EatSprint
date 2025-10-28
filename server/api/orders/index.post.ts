import type { CreateOrderRequest, Order } from '~/types/order'

/**
 * POST /api/orders
 * Crée une nouvelle commande pour l'utilisateur connecté
 * @requires Cookie auth_user_id
 * @body CreateOrderRequest - Items de la commande et total
 * @returns { order: Order } - Commande créée
 * @throws 401 - Non authentifié
 * @throws 400 - Données invalides
 * @throws 500 - Erreur serveur
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Configuration Supabase manquante')
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration du serveur incomplète',
    })
  }

  const userId = getCookie(event, 'auth_user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié',
    })
  }

  try {
    const body = await readBody<CreateOrderRequest>(event)

    if (!body.items || body.items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La commande doit contenir au moins un article',
      })
    }

    if (!body.total || body.total <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le montant total est invalide',
      })
    }

    const orderData = {
      user_id: parseInt(userId),
      statut: 'en_attente',
      total: body.total,
    }

    const orderResponse = await $fetch<Order[]>(
      `${config.supabaseUrl}/rest/v1/orders`,
      {
        method: 'POST',
        headers: {
          apikey: config.supabaseKey,
          Authorization: `Bearer ${config.supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: orderData,
        timeout: 10000,
      }
    )

    if (!Array.isArray(orderResponse) || orderResponse.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la création de la commande',
      })
    }

    const order = orderResponse[0]

    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      plat_id: item.plat_id,
      quantity: item.quantity,
      prix_unitaire: item.prix_unitaire,
    }))

    await $fetch(`${config.supabaseUrl}/rest/v1/order_items`, {
      method: 'POST',
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: orderItems,
      timeout: 10000,
    })

    return { order }
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    })

    if (error.statusCode === 400 || error.statusCode === 401) {
      throw error
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service temporairement indisponible',
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la création de la commande',
    })
  }
})
