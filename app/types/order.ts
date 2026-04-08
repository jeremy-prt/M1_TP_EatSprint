import type { Plat } from './plat'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  orderId: number
  dishId: number
  quantity: number
  unitPrice: number
  dish?: Pick<Plat, 'id' | 'name' | 'image'>
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export type OrderWithItems = Order

export interface CreateOrderRequest {
  restaurantId: number
  items: {
    dishId: number
    quantity: number
  }[]
}
