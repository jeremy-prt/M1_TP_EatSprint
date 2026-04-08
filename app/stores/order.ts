import type { Order, OrderWithItems, CreateOrderRequest } from '~/types/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as OrderWithItems[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allOrders: (state): OrderWithItems[] => {
      return [...state.orders].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
    ordersCount: (state): number => state.orders.length,
    pendingOrders: (state): OrderWithItems[] => {
      return state.orders.filter(order => order.status === 'PENDING')
    },
    deliveredOrders: (state): OrderWithItems[] => {
      return state.orders.filter(order => order.status === 'DELIVERED')
    },
    totalSpent: (state): number => {
      return state.orders.reduce((sum, order) => sum + order.total, 0)
    },
    getOrderById: (state) => {
      return (orderId: number): OrderWithItems | undefined => {
        return state.orders.find(order => order.id === orderId)
      }
    },
    isLoading: (state): boolean => state.loading,
  },

  actions: {
    async createOrder(orderData: CreateOrderRequest) {
      const { apiFetch } = useApi()
      this.loading = true
      this.error = null

      try {
        const order = await apiFetch<Order>('/orders', {
          method: 'POST',
          body: orderData,
        })

        await this.fetchOrders()

        return { success: true, order }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la commande'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrders() {
      const { apiFetch } = useApi()
      this.loading = true
      this.error = null

      try {
        const response = await apiFetch<{ data: OrderWithItems[] }>('/orders')
        this.orders = response.data

        return { success: true, orders: response.data }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la récupération des commandes'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearOrders() {
      this.orders = []
      this.error = null
    },
  },

  persist: true,
})
