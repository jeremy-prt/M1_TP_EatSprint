import type { Restaurant } from '~/types/restaurant'
import type { ApiResponse } from '~/types/api'

export const useMyRestaurants = () => {
  const { apiFetch } = useApi()
  const restaurants = ref<Restaurant[]>([])
  const pending = ref(true)
  const error = ref('')

  const showSkeleton = useDelayedPending(pending, 200)

  const fetchMyRestaurants = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      restaurants.value = await apiFetch<Restaurant[]>('/restaurants/mine')
    } catch (err: any) {
      error.value = err.data?.detail || 'Erreur lors du chargement des restaurants'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchMyRestaurants

  const updateRestaurant = async (
    restaurantId: number,
    data: Partial<Restaurant>
  ): Promise<ApiResponse<Restaurant>> => {
    try {
      const restaurant = await apiFetch<Restaurant>(
        `/restaurants/${restaurantId}`,
        {
          method: 'PUT',
          body: data
        }
      )

      return { success: true, data: restaurant }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la modification'
      }
    }
  }

  return {
    restaurants,
    pending: showSkeleton,
    error,
    fetchMyRestaurants,
    refresh,
    updateRestaurant
  }
}
