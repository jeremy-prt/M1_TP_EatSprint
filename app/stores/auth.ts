import type { User, LoginRequest, RegisterRequest } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userName: (state) => state.user?.name || 'Invité',
    userRole: (state) => state.user?.role || null,
    isCustomer: (state) => state.user?.role === 'customer',
    isAdmin: (state) => state.user?.role === 'admin',
    isRestaurantOwner: (state) => state.user?.role === 'restaurant_owner'
  },

  actions: {
    async login(credentials: LoginRequest) {
      try {
        const { user } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        this.user = user
        this.isAuthenticated = true

        return { success: true, user }
      } catch (error: any) {
        console.error('Erreur login:', error)
        throw error
      }
    },

    async register(data: RegisterRequest) {
      try {
        const { user } = await $fetch('/api/auth/register', {
          method: 'POST',
          body: data
        })

        this.user = user
        this.isAuthenticated = true

        return { success: true, user }
      } catch (error: any) {
        console.error('Erreur register:', error)
        throw error
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST'
        })

        this.user = null
        this.isAuthenticated = false

        return { success: true }
      } catch (error: any) {
        console.error('Erreur logout:', error)
        throw error
      }
    },

    async fetchUser() {
      try {
        const { user } = await $fetch('/api/auth/me')

        this.user = user
        this.isAuthenticated = true

        return { success: true, user }
      } catch (error: any) {
        this.user = null
        this.isAuthenticated = false
        throw error
      }
    }
  },

  persist: true
})
