import type { Restaurant } from '~/types/restaurant'
import type { ApiResponse } from '~/types/api'

export const useAdminRestaurants = () => {
  const { apiFetch } = useApi()
  const restaurants = ref<Restaurant[]>([])
  const pending = ref(true)
  const error = ref('')

  const showSkeleton = useDelayedPending(pending, 200)

  const fetchRestaurants = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      restaurants.value = await apiFetch<Restaurant[]>('/admin/restaurants')
    } catch (err: any) {
      error.value = err.data?.detail || 'Erreur lors du chargement des restaurants'
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
      const restaurant = await apiFetch<Restaurant>(
        `/admin/restaurants/${restaurantId}`,
        {
          method: 'PUT',
          body: { ownerId },
        }
      )

      return { success: true, data: restaurant }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || "Erreur lors de l'assignation",
      }
    }
  }

  const getRestaurantByOwnerId = (ownerId: number): Restaurant | undefined => {
    return restaurants.value.find((r) => r.ownerId === ownerId)
  }

  const getAvailableRestaurants = (currentOwnerId?: number): Restaurant[] => {
    return restaurants.value.filter(
      (r) => !r.ownerId || r.ownerId === currentOwnerId
    )
  }

  return {
    restaurants,
    pending: showSkeleton,
    error,
    fetchRestaurants,
    refresh,
    assignRestaurant,
    getRestaurantByOwnerId,
    getAvailableRestaurants,
  }
}
