import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrderStore } from '~/stores/order'
import type { OrderWithItems } from '~/types/order'

/**
 * Tests unitaires du store Order
 * Vérifie l'état initial, les getters et les actions du store de commandes
 */
describe('Store Order', () => {
  let mockOrder1: OrderWithItems
  let mockOrder2: OrderWithItems

  beforeEach(() => {
    setActivePinia(createPinia())

    mockOrder1 = {
      id: 1,
      user_id: 1,
      total: 50.5,
      statut: 'en_attente',
      adresse_livraison: '123 rue Test',
      created_at: '2025-01-15T10:00:00Z',
      items: [
        {
          id: 1,
          order_id: 1,
          plat_id: 1,
          quantite: 2,
          prix_unitaire: 25.25,
          plat: {
            id: 1,
            nom: 'Pizza Margherita',
            description: 'Pizza classique',
            prix: 25.25,
            categorie: 'Pizza',
            image: '/pizza.jpg',
            restaurant_id: 1,
            disponible: true,
            created_at: new Date().toISOString(),
          }
        }
      ]
    }

    mockOrder2 = {
      id: 2,
      user_id: 1,
      total: 30.0,
      statut: 'livree',
      adresse_livraison: '456 avenue Test',
      created_at: '2025-01-14T09:00:00Z',
      items: [
        {
          id: 2,
          order_id: 2,
          plat_id: 2,
          quantite: 1,
          prix_unitaire: 30.0,
          plat: {
            id: 2,
            nom: 'Burger Classic',
            description: 'Burger avec frites',
            prix: 30.0,
            categorie: 'Burger',
            image: '/burger.jpg',
            restaurant_id: 1,
            disponible: true,
            created_at: new Date().toISOString(),
          }
        }
      ]
    }
  })

  /**
   * Vérifie que le store s'initialise avec un état vide
   */
  it('initialise avec un état vide', () => {
    const orderStore = useOrderStore()

    expect(orderStore.orders).toEqual([])
    expect(orderStore.loading).toBe(false)
    expect(orderStore.error).toBe(null)
    expect(orderStore.ordersCount).toBe(0)
  })

  /**
   * Teste le getter ordersCount
   */
  it('ordersCount retourne le nombre de commandes', () => {
    const orderStore = useOrderStore()

    expect(orderStore.ordersCount).toBe(0)

    orderStore.orders = [mockOrder1]
    expect(orderStore.ordersCount).toBe(1)

    orderStore.orders = [mockOrder1, mockOrder2]
    expect(orderStore.ordersCount).toBe(2)
  })

  /**
   * Teste le getter allOrders (tri par date décroissante)
   */
  it('allOrders retourne les commandes triées par date (plus récentes en premier)', () => {
    const orderStore = useOrderStore()

    orderStore.orders = [mockOrder2, mockOrder1]
    const sorted = orderStore.allOrders

    expect(sorted).toHaveLength(2)
    expect(sorted[0].id).toBe(1) // Plus récente (2025-01-15)
    expect(sorted[1].id).toBe(2) // Plus ancienne (2025-01-14)
  })

  /**
   * Teste le getter pendingOrders
   */
  it('pendingOrders retourne uniquement les commandes en attente', () => {
    const orderStore = useOrderStore()

    orderStore.orders = [mockOrder1, mockOrder2]
    const pending = orderStore.pendingOrders

    expect(pending).toHaveLength(1)
    expect(pending[0].statut).toBe('en_attente')
    expect(pending[0].id).toBe(1)
  })

  /**
   * Teste le getter deliveredOrders
   */
  it('deliveredOrders retourne uniquement les commandes livrées', () => {
    const orderStore = useOrderStore()

    orderStore.orders = [mockOrder1, mockOrder2]
    const delivered = orderStore.deliveredOrders

    expect(delivered).toHaveLength(1)
    expect(delivered[0].statut).toBe('livree')
    expect(delivered[0].id).toBe(2)
  })

  /**
   * Teste le getter totalSpent
   */
  it('totalSpent calcule le montant total dépensé', () => {
    const orderStore = useOrderStore()

    expect(orderStore.totalSpent).toBe(0)

    orderStore.orders = [mockOrder1]
    expect(orderStore.totalSpent).toBe(50.5)

    orderStore.orders = [mockOrder1, mockOrder2]
    expect(orderStore.totalSpent).toBe(80.5) // 50.5 + 30.0
  })

  /**
   * Teste le getter getOrderById
   */
  it('getOrderById retourne la commande correspondante', () => {
    const orderStore = useOrderStore()

    orderStore.orders = [mockOrder1, mockOrder2]

    const order1 = orderStore.getOrderById(1)
    expect(order1).toBeDefined()
    expect(order1?.id).toBe(1)
    expect(order1?.total).toBe(50.5)

    const order2 = orderStore.getOrderById(2)
    expect(order2).toBeDefined()
    expect(order2?.id).toBe(2)
    expect(order2?.total).toBe(30.0)

    const notFound = orderStore.getOrderById(999)
    expect(notFound).toBeUndefined()
  })

  /**
   * Teste le getter isLoading
   */
  it('isLoading reflète l\'état de chargement', () => {
    const orderStore = useOrderStore()

    expect(orderStore.isLoading).toBe(false)

    orderStore.loading = true
    expect(orderStore.isLoading).toBe(true)

    orderStore.loading = false
    expect(orderStore.isLoading).toBe(false)
  })

  /**
   * Teste l'action clearOrders
   */
  it('clearOrders réinitialise le store', () => {
    const orderStore = useOrderStore()

    orderStore.orders = [mockOrder1, mockOrder2]
    orderStore.error = 'Une erreur test'

    expect(orderStore.orders).toHaveLength(2)
    expect(orderStore.error).toBe('Une erreur test')

    orderStore.clearOrders()

    expect(orderStore.orders).toEqual([])
    expect(orderStore.error).toBe(null)
  })

  /**
   * Teste la gestion de l'état avec plusieurs commandes
   */
  it('gère correctement plusieurs commandes avec différents statuts', () => {
    const orderStore = useOrderStore()

    const mockOrder3: OrderWithItems = {
      id: 3,
      user_id: 1,
      total: 45.0,
      statut: 'en_preparation',
      adresse_livraison: '789 boulevard Test',
      created_at: '2025-01-16T11:00:00Z',
      items: []
    }

    orderStore.orders = [mockOrder1, mockOrder2, mockOrder3]

    expect(orderStore.ordersCount).toBe(3)
    expect(orderStore.pendingOrders).toHaveLength(1)
    expect(orderStore.deliveredOrders).toHaveLength(1)
    expect(orderStore.totalSpent).toBe(125.5) // 50.5 + 30.0 + 45.0

    const allOrders = orderStore.allOrders
    expect(allOrders[0].id).toBe(3) // Plus récente
    expect(allOrders[2].id).toBe(2) // Plus ancienne
  })

  /**
   * Teste la persistance de l'erreur
   */
  it('conserve l\'erreur après échec', () => {
    const orderStore = useOrderStore()

    orderStore.error = 'Erreur de connexion'
    expect(orderStore.error).toBe('Erreur de connexion')

    orderStore.clearOrders()
    expect(orderStore.error).toBe(null)
  })
})
