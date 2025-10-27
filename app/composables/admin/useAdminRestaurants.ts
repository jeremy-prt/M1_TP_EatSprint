import type { Restaurant } from '~/types/restaurant'
import type { ApiResponse } from '~/types/api'

/**
 * Composable pour gérer les restaurants côté admin
 * Permet l'assignation de restaurants aux restaurateurs
 */
export const useAdminRestaurants = () => {
  const restaurants = ref<Restaurant[]>([])
  const pending = ref(true)
  const error = ref('')

  // Utilise le délai pour éviter les flashs de skeleton sur connexion rapide
  const showSkeleton = useDelayedPending(pending, 200)

  /**
   * Récupère tous les restaurants depuis l'API admin
   */
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

  /**
   * Assigne ou désassigne un restaurant à un restaurateur
   * @param restaurantId - ID du restaurant
   * @param ownerId - ID du restaurateur (null pour désassigner)
   * @returns ApiResponse avec le restaurant mis à jour
   */
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

  /**
   * Trouve le restaurant assigné à un restaurateur donné
   * @param ownerId - ID du restaurateur
   * @returns Restaurant trouvé ou undefined
   */
  const getRestaurantByOwnerId = (ownerId: number): Restaurant | undefined => {
    return restaurants.value.find((r) => r.owner_id === ownerId)
  }

  /**
   * Retourne la liste des restaurants disponibles (non assignés ou assignés au owner actuel)
   * @param currentOwnerId - ID du restaurateur en cours d'édition (optionnel)
   * @returns Liste des restaurants disponibles pour assignation
   */
  const getAvailableRestaurants = (currentOwnerId?: number): Restaurant[] => {
    return restaurants.value.filter(
      (r) => !r.owner_id || r.owner_id === currentOwnerId
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
