import type { User, LoginRequest, RegisterRequest } from '~/types/auth'

/**
 * Store Pinia pour la gestion de l'authentification
 * Gère l'état de connexion, les informations utilisateur et persiste les données
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),

  getters: {
    /**
     * Vérifie si l'utilisateur est authentifié
     */
    isLoggedIn: (state) => state.isAuthenticated,

    /**
     * Retourne le nom de l'utilisateur ou "Invité"
     */
    userName: (state) => state.user?.name || 'Invité',

    /**
     * Retourne le rôle de l'utilisateur ou null
     */
    userRole: (state) => state.user?.role || null,

    /**
     * Vérifie si l'utilisateur est un client
     */
    isCustomer: (state) => state.user?.role === 'customer',

    /**
     * Vérifie si l'utilisateur est un administrateur
     */
    isAdmin: (state) => state.user?.role === 'admin',

    /**
     * Vérifie si l'utilisateur est un propriétaire de restaurant
     */
    isRestaurantOwner: (state) => state.user?.role === 'restaurant_owner'
  },

  actions: {
    /**
     * Authentifie un utilisateur avec email et mot de passe
     * @param credentials - Identifiants de connexion (email, password)
     * @returns Promesse avec l'utilisateur authentifié
     * @throws Erreur en cas d'échec de connexion
     */
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

    /**
     * Inscrit un nouvel utilisateur
     * @param data - Données d'inscription (email, password, name, etc.)
     * @returns Promesse avec l'utilisateur créé
     * @throws Erreur en cas d'échec de l'inscription
     */
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

    /**
     * Déconnecte l'utilisateur actuel
     * @returns Promesse avec le statut de succès
     * @throws Erreur en cas d'échec de la déconnexion
     */
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

    /**
     * Récupère les informations de l'utilisateur actuellement connecté
     * @returns Promesse avec l'utilisateur ou erreur si non connecté
     * @throws Erreur si l'utilisateur n'est pas authentifié
     */
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
