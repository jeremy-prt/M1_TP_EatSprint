import type { Plat } from '~/types/plat'
import type { CartItem } from '~/types/cart'

/**
 * Store Pinia pour la gestion du panier
 * Gère les articles du panier et persiste les données
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /**
     * Retourne le nombre total d'articles dans le panier
     */
    itemsCount: (state): number => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    /**
     * Retourne le montant total du panier
     */
    totalPrice: (state): number => {
      return state.items.reduce(
        (total, item) => total + item.plat.prix * item.quantity,
        0
      )
    },

    /**
     * Vérifie si le panier est vide
     */
    isEmpty: (state): boolean => {
      return state.items.length === 0
    },

    /**
     * Retourne un article du panier par ID de plat
     * @param platId - ID du plat à rechercher
     */
    getItemByPlatId: (state) => {
      return (platId: number): CartItem | undefined => {
        return state.items.find((item) => item.plat.id === platId)
      }
    },

    /**
     * Retourne la quantité d'un plat dans le panier
     * @param platId - ID du plat
     */
    getQuantityByPlatId: (state) => {
      return (platId: number): number => {
        const item = state.items.find((item) => item.plat.id === platId)
        return item ? item.quantity : 0
      }
    },
  },

  actions: {
    /**
     * Ajoute un plat au panier ou augmente sa quantité
     * @param plat - Plat à ajouter
     * @param quantity - Quantité à ajouter (défaut: 1)
     */
    addItem(plat: Plat, quantity: number = 1) {
      const existingItem = this.items.find((item) => item.plat.id === plat.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ plat, quantity })
      }
    },

    /**
     * Retire complètement un plat du panier
     * @param platId - ID du plat à retirer
     */
    removeItem(platId: number) {
      const index = this.items.findIndex((item) => item.plat.id === platId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },

    /**
     * Met à jour la quantité d'un article du panier
     * @param platId - ID du plat
     * @param quantity - Nouvelle quantité
     */
    updateQuantity(platId: number, quantity: number) {
      if (quantity <= 0) {
        this.removeItem(platId)
        return
      }

      const item = this.items.find((item) => item.plat.id === platId)
      if (item) {
        item.quantity = quantity
      }
    },

    /**
     * Diminue la quantité d'un article du panier de 1
     * Retire l'article si la quantité atteint 0
     * @param platId - ID du plat
     */
    decrementQuantity(platId: number) {
      const item = this.items.find((item) => item.plat.id === platId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
        } else {
          this.removeItem(platId)
        }
      }
    },

    /**
     * Augmente la quantité d'un article du panier de 1
     * @param platId - ID du plat
     */
    incrementQuantity(platId: number) {
      const item = this.items.find((item) => item.plat.id === platId)
      if (item) {
        item.quantity++
      }
    },

    /**
     * Vide complètement le panier
     */
    clearCart() {
      this.items = []
    },
  },

  persist: true,
})
