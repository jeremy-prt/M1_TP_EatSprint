import type { User, LoginRequest, RegisterRequest, AuthResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userName: (state) => state.user?.name || 'Invité',
    userRole: (state) => state.user?.role || null,
    isCustomer: (state) => state.user?.role === 'CUSTOMER',
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isRestaurantOwner: (state) => state.user?.role === 'RESTAURANT_OWNER'
  },

  actions: {
    async login(credentials: LoginRequest) {
      const { apiFetch } = useApi()

      const response = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: credentials
      })

      this.user = response.user
      this.accessToken = response.accessToken
      this.refreshToken = response.refreshToken
      this.isAuthenticated = true

      return { success: true, user: response.user }
    },

    async register(data: RegisterRequest) {
      const { apiFetch } = useApi()

      const response = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: data
      })

      this.user = response.user
      this.accessToken = response.accessToken
      this.refreshToken = response.refreshToken
      this.isAuthenticated = true

      return { success: true, user: response.user }
    },

    async logout() {
      const { apiFetch } = useApi()

      try {
        if (this.refreshToken) {
          await apiFetch('/auth/logout', {
            method: 'POST',
            body: { refreshToken: this.refreshToken }
          })
        }
      } finally {
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        this.isAuthenticated = false
      }

      return { success: true }
    },

    async fetchUser() {
      const { apiFetch } = useApi()

      const { user } = await apiFetch<{ user: User }>('/auth/me')

      this.user = user
      this.isAuthenticated = true

      return { success: true, user }
    },

    async refreshAccessToken() {
      const { apiFetch } = useApi()

      if (!this.refreshToken) throw new Error('No refresh token')

      const response = await apiFetch<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken: this.refreshToken }
      })

      this.user = response.user
      this.accessToken = response.accessToken
      this.refreshToken = response.refreshToken

      return response.accessToken
    }
  },

  persist: true
})
