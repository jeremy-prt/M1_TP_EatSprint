import type { Order, OrderItem, OrderWithItems } from '~/types/order'
import type { Plat } from '~/types/plat'

/**
 * GET /api/orders
 * Récupère toutes les commandes de l'utilisateur connecté avec leurs items et plats
 * @requires Cookie auth_user_id
 * @returns { orders: OrderWithItems[] } - Liste des commandes avec leurs détails
 * @throws 401 - Non authentifié
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
    const ordersResponse = await $fetch<Order[]>(
      `${config.supabaseUrl}/rest/v1/orders`,
      {
        method: 'GET',
        headers: {
          apikey: config.supabaseKey,
          Authorization: `Bearer ${config.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        query: {
          user_id: `eq.${userId}`,
          select: '*',
          order: 'created_at.desc',
        },
        timeout: 10000,
      }
    )

    if (!Array.isArray(ordersResponse)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Format de données invalide',
      })
    }

    const ordersWithItems: OrderWithItems[] = await Promise.all(
      ordersResponse.map(async (order) => {
        const itemsResponse = await $fetch<OrderItem[]>(
          `${config.supabaseUrl}/rest/v1/order_items`,
          {
            method: 'GET',
            headers: {
              apikey: config.supabaseKey,
              Authorization: `Bearer ${config.supabaseKey}`,
              'Content-Type': 'application/json',
            },
            query: {
              order_id: `eq.${order.id}`,
              select: '*',
            },
            timeout: 10000,
          }
        )

        const itemsWithPlats = await Promise.all(
          itemsResponse.map(async (item) => {
            const platResponse = await $fetch<Plat[]>(
              `${config.supabaseUrl}/rest/v1/plats`,
              {
                method: 'GET',
                headers: {
                  apikey: config.supabaseKey,
                  Authorization: `Bearer ${config.supabaseKey}`,
                  'Content-Type': 'application/json',
                },
                query: {
                  id: `eq.${item.plat_id}`,
                  select: '*',
                },
                timeout: 10000,
              }
            )

            return {
              ...item,
              plat: platResponse[0] || null,
            }
          })
        )

        return {
          ...order,
          items: itemsWithPlats,
        }
      })
    )

    return { orders: ordersWithItems }
  } catch (error: any) {
    console.error('Erreur lors de la récupération des commandes:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    })

    if (error.statusCode === 401) {
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
      statusMessage:
        error.message || 'Erreur lors de la récupération des commandes',
    })
  }
})
