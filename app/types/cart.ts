import type { Plat } from './plat'

/**
 * Article dans le panier
 * Contient le plat et la quantité commandée
 */
export interface CartItem {
  plat: Plat
  quantity: number
}
