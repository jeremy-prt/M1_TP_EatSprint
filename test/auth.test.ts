import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { User } from '~/types/auth'

/**
 * Tests unitaires du store Auth
 * Vérifie l'état initial, les getters et les actions du store d'authentification
 */
describe('Store Auth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /**
   * Vérifie que le store s'initialise avec un état vide
   */
  it('initialise avec un état vide', () => {
    const authStore = useAuthStore()

    expect(authStore.user).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })

  /**
   * Vérifie que le getter isLoggedIn retourne false par défaut
   */
  it('getter isLoggedIn retourne false par défaut', () => {
    const authStore = useAuthStore()

    expect(authStore.isLoggedIn).toBe(false)
  })

  /**
   * Vérifie que le getter userName retourne "Invité" quand non connecté
   */
  it('getter userName retourne "Invité" quand non connecté', () => {
    const authStore = useAuthStore()

    expect(authStore.userName).toBe('Invité')
  })

  /**
   * Vérifie que le getter userName retourne le nom de l'utilisateur quand connecté
   */
  it('getter userName retourne le nom de l\'utilisateur quand connecté', () => {
    const authStore = useAuthStore()
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'John Doe',
      role: 'customer',
      created_at: new Date().toISOString(),
    }

    authStore.user = mockUser
    authStore.isAuthenticated = true

    expect(authStore.userName).toBe('John Doe')
  })

  /**
   * Vérifie que le getter userRole retourne null par défaut
   */
  it('getter userRole retourne null par défaut', () => {
    const authStore = useAuthStore()

    expect(authStore.userRole).toBeNull()
  })

  /**
   * Vérifie que le getter userRole retourne le rôle de l'utilisateur
   */
  it('getter userRole retourne le rôle de l\'utilisateur', () => {
    const authStore = useAuthStore()
    const mockUser: User = {
      id: 1,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date().toISOString(),
    }

    authStore.user = mockUser
    authStore.isAuthenticated = true

    expect(authStore.userRole).toBe('admin')
  })

  /**
   * Vérifie que le getter isCustomer retourne true pour un client
   */
  it('getter isCustomer retourne true pour un client', () => {
    const authStore = useAuthStore()
    const mockUser: User = {
      id: 1,
      email: 'customer@example.com',
      name: 'Customer User',
      role: 'customer',
      created_at: new Date().toISOString(),
    }

    authStore.user = mockUser
    authStore.isAuthenticated = true

    expect(authStore.isCustomer).toBe(true)
    expect(authStore.isAdmin).toBe(false)
    expect(authStore.isRestaurantOwner).toBe(false)
  })

  /**
   * Vérifie que le getter isAdmin retourne true pour un admin
   */
  it('getter isAdmin retourne true pour un admin', () => {
    const authStore = useAuthStore()
    const mockUser: User = {
      id: 1,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date().toISOString(),
    }

    authStore.user = mockUser
    authStore.isAuthenticated = true

    expect(authStore.isAdmin).toBe(true)
    expect(authStore.isCustomer).toBe(false)
    expect(authStore.isRestaurantOwner).toBe(false)
  })

  /**
   * Vérifie que le getter isRestaurantOwner retourne true pour un restaurateur
   */
  it('getter isRestaurantOwner retourne true pour un restaurateur', () => {
    const authStore = useAuthStore()
    const mockUser: User = {
      id: 1,
      email: 'owner@example.com',
      name: 'Restaurant Owner',
      role: 'restaurant_owner',
      created_at: new Date().toISOString(),
    }

    authStore.user = mockUser
    authStore.isAuthenticated = true

    expect(authStore.isRestaurantOwner).toBe(true)
    expect(authStore.isAdmin).toBe(false)
    expect(authStore.isCustomer).toBe(false)
  })

  /**
   * Vérifie que l'état est réinitialisé après déconnexion manuelle
   */
  it('réinitialise l\'état après déconnexion manuelle', () => {
    const authStore = useAuthStore()
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer',
      created_at: new Date().toISOString(),
    }

    authStore.user = mockUser
    authStore.isAuthenticated = true

    expect(authStore.isLoggedIn).toBe(true)
    expect(authStore.userName).toBe('Test User')

    authStore.user = null
    authStore.isAuthenticated = false

    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.userName).toBe('Invité')
    expect(authStore.userRole).toBeNull()
  })
})
