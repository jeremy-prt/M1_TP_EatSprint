/**
 * Composable pour gérer le panier
 * Retourne l'accès au store Pinia du panier avec computed pour la réactivité
 */
export const useCart = () => {
  const cartStore = useCartStore()

  return {
    items: computed(() => cartStore.items),
    itemsCount: computed(() => cartStore.itemsCount),
    totalPrice: computed(() => cartStore.totalPrice),
    isEmpty: computed(() => cartStore.isEmpty),
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    decrementQuantity: cartStore.decrementQuantity,
    incrementQuantity: cartStore.incrementQuantity,
    clearCart: cartStore.clearCart,
    getQuantity: cartStore.getQuantityByPlatId,
  }
}
