import type { Order, OrderWithItems, CreateOrderRequest } from '~/types/order'

/**
 * Store Pinia pour la gestion des commandes
 * Gère l'état des commandes utilisateur et persiste les données
 */
export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as OrderWithItems[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Retourne toutes les commandes triées par date (plus récentes en premier)
     */
    allOrders: (state): OrderWithItems[] => {
      return [...state.orders].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },

    /**
     * Retourne le nombre total de commandes
     */
    ordersCount: (state): number => {
      return state.orders.length
    },

    /**
     * Retourne les commandes en attente
     */
    pendingOrders: (state): OrderWithItems[] => {
      return state.orders.filter(order => order.statut === 'en_attente')
    },

    /**
     * Retourne les commandes livrées
     */
    deliveredOrders: (state): OrderWithItems[] => {
      return state.orders.filter(order => order.statut === 'livree')
    },

    /**
     * Calcule le montant total dépensé sur toutes les commandes
     */
    totalSpent: (state): number => {
      return state.orders.reduce((sum, order) => sum + order.total, 0)
    },

    /**
     * Retourne une commande par son ID
     * @param orderId - ID de la commande
     */
    getOrderById: (state) => {
      return (orderId: number): OrderWithItems | undefined => {
        return state.orders.find(order => order.id === orderId)
      }
    },

    /**
     * Vérifie si le store est en cours de chargement
     */
    isLoading: (state): boolean => {
      return state.loading
    },
  },

  actions: {
    /**
     * Crée une nouvelle commande
     * @param orderData - Données de la commande à créer
     * @returns Promesse avec la commande créée
     * @throws Erreur en cas d'échec
     */
    async createOrder(orderData: CreateOrderRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{ order: Order }>('/api/orders', {
          method: 'POST',
          body: orderData,
        })

        await this.fetchOrders()

        return { success: true, order: response.order }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la commande'
        console.error('Erreur createOrder:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupère toutes les commandes de l'utilisateur connecté
     * @returns Promesse avec les commandes
     * @throws Erreur en cas d'échec
     */
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{ orders: OrderWithItems[] }>('/api/orders')
        this.orders = response.orders

        return { success: true, orders: response.orders }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la récupération des commandes'
        console.error('Erreur fetchOrders:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Réinitialise l'état des commandes
     */
    clearOrders() {
      this.orders = []
      this.error = null
    },
  },

  persist: true,
})
