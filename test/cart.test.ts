import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'
import type { Plat } from '~/types/plat'

/**
 * Tests unitaires du store Cart
 * Vérifie l'état initial, les getters et les actions du store de panier
 */
describe('Store Cart', () => {
  let mockPlat1: Plat
  let mockPlat2: Plat

  beforeEach(() => {
    setActivePinia(createPinia())

    mockPlat1 = {
      id: 1,
      nom: 'Pizza Margherita',
      description: 'Pizza classique',
      prix: 12.5,
      categorie: 'Pizza',
      image: '/pizza.jpg',
      restaurant_id: 1,
      disponible: true,
      created_at: new Date().toISOString(),
    }

    mockPlat2 = {
      id: 2,
      nom: 'Burger Classic',
      description: 'Burger avec frites',
      prix: 15.0,
      categorie: 'Burger',
      image: '/burger.jpg',
      restaurant_id: 1,
      disponible: true,
      created_at: new Date().toISOString(),
    }
  })

  /**
   * Vérifie que le store s'initialise avec un panier vide
   */
  it('initialise avec un panier vide', () => {
    const cartStore = useCartStore()

    expect(cartStore.items).toEqual([])
    expect(cartStore.isEmpty).toBe(true)
    expect(cartStore.itemsCount).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  /**
   * Vérifie qu'un article peut être ajouté au panier
   */
  it('ajoute un article au panier', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].plat.id).toBe(1)
    expect(cartStore.items[0].quantity).toBe(1)
    expect(cartStore.isEmpty).toBe(false)
  })

  /**
   * Vérifie que la quantité augmente si le plat existe déjà dans le panier
   */
  it('augmente la quantité si le plat existe déjà', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)
    cartStore.addItem(mockPlat1, 2)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(3)
  })

  /**
   * Vérifie que plusieurs plats différents peuvent être ajoutés
   */
  it('ajoute plusieurs plats différents', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)
    cartStore.addItem(mockPlat2, 2)

    expect(cartStore.items).toHaveLength(2)
    expect(cartStore.itemsCount).toBe(3)
  })

  /**
   * Vérifie que le getter itemsCount calcule correctement le nombre total d'articles
   */
  it('getter itemsCount calcule le nombre total d\'articles', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 2)
    cartStore.addItem(mockPlat2, 3)

    expect(cartStore.itemsCount).toBe(5)
  })

  /**
   * Vérifie que le getter totalPrice calcule correctement le prix total
   */
  it('getter totalPrice calcule le prix total', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 2)
    cartStore.addItem(mockPlat2, 1)

    expect(cartStore.totalPrice).toBe(12.5 * 2 + 15.0 * 1)
  })

  /**
   * Vérifie que le getter isEmpty retourne true quand le panier est vide
   */
  it('getter isEmpty retourne true quand le panier est vide', () => {
    const cartStore = useCartStore()

    expect(cartStore.isEmpty).toBe(true)

    cartStore.addItem(mockPlat1, 1)

    expect(cartStore.isEmpty).toBe(false)
  })

  /**
   * Vérifie que le getter getQuantityByPlatId retourne la quantité correcte
   */
  it('getter getQuantityByPlatId retourne la quantité correcte', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 3)

    expect(cartStore.getQuantityByPlatId(1)).toBe(3)
    expect(cartStore.getQuantityByPlatId(999)).toBe(0)
  })

  /**
   * Vérifie que removeItem retire un article du panier
   */
  it('removeItem retire un article du panier', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)
    cartStore.addItem(mockPlat2, 1)

    expect(cartStore.items).toHaveLength(2)

    cartStore.removeItem(1)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].plat.id).toBe(2)
  })

  /**
   * Vérifie que updateQuantity met à jour la quantité d'un article
   */
  it('updateQuantity met à jour la quantité', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)
    cartStore.updateQuantity(1, 5)

    expect(cartStore.items[0].quantity).toBe(5)
  })

  /**
   * Vérifie que updateQuantity retire l'article si la quantité est inférieure ou égale à 0
   */
  it('updateQuantity retire l\'article si quantité <= 0', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)
    cartStore.updateQuantity(1, 0)

    expect(cartStore.items).toHaveLength(0)
  })

  /**
   * Vérifie que incrementQuantity augmente la quantité de 1
   */
  it('incrementQuantity augmente la quantité de 1', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 2)
    cartStore.incrementQuantity(1)

    expect(cartStore.items[0].quantity).toBe(3)
  })

  /**
   * Vérifie que decrementQuantity diminue la quantité de 1
   */
  it('decrementQuantity diminue la quantité de 1', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 3)
    cartStore.decrementQuantity(1)

    expect(cartStore.items[0].quantity).toBe(2)
  })

  /**
   * Vérifie que decrementQuantity retire l'article si la quantité est égale à 1
   */
  it('decrementQuantity retire l\'article si quantité = 1', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 1)
    cartStore.decrementQuantity(1)

    expect(cartStore.items).toHaveLength(0)
  })

  /**
   * Vérifie que clearCart vide complètement le panier
   */
  it('clearCart vide complètement le panier', () => {
    const cartStore = useCartStore()

    cartStore.addItem(mockPlat1, 2)
    cartStore.addItem(mockPlat2, 3)

    expect(cartStore.items).toHaveLength(2)

    cartStore.clearCart()

    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.isEmpty).toBe(true)
    expect(cartStore.itemsCount).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
  })
})
