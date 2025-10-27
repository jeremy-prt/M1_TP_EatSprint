import type { Restaurant } from '~/types/restaurant'

interface ApiResponse<T> {
  success: boolean
  error?: string
  data?: T
}

export const useAdminRestaurants = () => {
  const restaurants = ref<Restaurant[]>([])
  const pending = ref(true)
  const error = ref('')

  const fetchRestaurants = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      restaurants.value = await $fetch<Restaurant[]>('/api/admin/restaurants')
    } catch (err: any) {
      error.value =
        err.data?.statusMessage || 'Erreur lors du chargement des restaurants'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchRestaurants

  const assignRestaurant = async (
    restaurantId: number,
    ownerId: number | null
  ): Promise<ApiResponse<Restaurant>> => {
    try {
      const response = await $fetch<{ restaurant: Restaurant }>(
        `/api/admin/restaurants/${restaurantId}`,
        {
          method: 'PUT',
          body: {
            owner_id: ownerId,
          },
        }
      )

      return { success: true, data: response.restaurant }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || "Erreur lors de l'assignation",
      }
    }
  }

  const getRestaurantByOwnerId = (ownerId: number): Restaurant | undefined => {
    return restaurants.value.find((r) => r.owner_id === ownerId)
  }

  const getAvailableRestaurants = (currentOwnerId?: number): Restaurant[] => {
    return restaurants.value.filter(
      (r) => !r.owner_id || r.owner_id === currentOwnerId
    )
  }

  return {
    restaurants,
    pending,
    error,
    fetchRestaurants,
    refresh,
    assignRestaurant,
    getRestaurantByOwnerId,
    getAvailableRestaurants,
  }
}
