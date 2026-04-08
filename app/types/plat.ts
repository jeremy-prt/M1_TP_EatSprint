export interface Plat {
  id: number
  name: string
  slug: string
  price: number
  description: string
  category: string
  restaurantId: number
  calories: number
  preparationTime: number
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
  allergens: string | null
  isAvailable: boolean
  image: string
  createdAt: string
  updatedAt: string
}
