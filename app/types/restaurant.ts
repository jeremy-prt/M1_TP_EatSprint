export interface Restaurant {
  id: number
  name: string
  address: string
  city: string
  category: string
  image: string
  cuisine: string
  rating: number
  reviewCount: number
  priceRange: string
  deliveryTimeMin: number
  slug: string
  ownerId: number | null
  createdAt: string
  updatedAt: string
}
