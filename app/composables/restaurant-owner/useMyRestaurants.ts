import type { Restaurant } from '~/types/restaurant'
import type { ApiResponse } from '~/types/api'

/**
 * Composable pour gérer les restaurants du restaurateur connecté
 * Gère le fetch, la mise à jour et l'état global des restaurants
 */
export const useMyRestaurants = () => {
  const restaurants = ref<Restaurant[]>([])
  const pending = ref(true)
  const error = ref('')

  // Utilise le délai pour éviter les flashs de skeleton sur connexion rapide
  const showSkeleton = useDelayedPending(pending, 200)

  /**
   * Récupère la liste des restaurants appartenant au restaurateur connecté
   */
  const fetchMyRestaurants = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      restaurants.value = await $fetch<Restaurant[]>('/api/restaurants/mine')
    } catch (err: any) {
      error.value =
        err.data?.statusMessage || 'Erreur lors du chargement des restaurants'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchMyRestaurants

  /**
   * Met à jour les informations d'un restaurant
   * @param restaurantId - ID du restaurant à mettre à jour
   * @param data - Données partielles du restaurant à modifier
   * @returns ApiResponse avec le restaurant mis à jour
   */
  const updateRestaurant = async (
    restaurantId: number,
    data: Partial<Restaurant>
  ): Promise<ApiResponse<Restaurant>> => {
    try {
      const response = await $fetch<{ restaurant: Restaurant }>(
        `/api/restaurants/${restaurantId}`,
        {
          method: 'PUT',
          body: data
        }
      )

      return { success: true, data: response.restaurant }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la modification'
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
