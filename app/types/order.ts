import type { Plat } from './plat'

export type OrderStatus = 'en_attente' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee'

/**
 * Article d'une commande
 * Représente un plat dans une commande avec sa quantité et son prix au moment de l'achat
 */
export interface OrderItem {
  id: number
  order_id: number
  plat_id: number
  quantity: number
  prix_unitaire: number
  plat?: Plat
}

/**
 * Commande complète
 * Contient toutes les informations d'une commande utilisateur
 */
export interface Order {
  id: number
  user_id: number
  statut: OrderStatus
  total: number
  created_at: string
  items?: OrderItem[]
}

/**
 * Détail d'une commande avec ses articles
 * Utilisé pour l'affichage complet d'une commande
 */
export interface OrderWithItems extends Order {
  items: OrderItem[]
}

/**
 * Requête de création de commande
 * Envoyée depuis le panier pour créer une nouvelle commande
 */
export interface CreateOrderRequest {
  items: {
    plat_id: number
    quantity: number
    prix_unitaire: number
  }[]
  total: number
}

/**
 * Réponse après création de commande
 */
export interface CreateOrderResponse {
  order: Order
  message: string
}
