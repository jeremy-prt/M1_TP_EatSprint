import type { Plat } from '~/types/plat'
import type { ApiResponse } from '~/types/api'

interface CreateDishData {
  name: string
  price: number
  description: string
  category: string
  calories: number
  preparationTime: number
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
  allergens: string | null
  isAvailable: boolean
  image: string
}

interface UpdateDishData extends Partial<CreateDishData> {}

export const useMyPlats = () => {
  const { apiFetch } = useApi()
  const plats = ref<Plat[]>([])
  const pending = ref(true)
  const error = ref('')

  const showSkeleton = useDelayedPending(pending, 200)

  const fetchPlats = async (restaurantId?: number): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      if (restaurantId) {
        const response = await apiFetch<{ data: Plat[] }>(`/restaurants/${restaurantId}/dishes?limit=100`)
        plats.value = response.data
      } else {
        plats.value = []
      }
    } catch (err: any) {
      error.value = err.data?.detail || 'Erreur lors du chargement des plats'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchPlats

  const getPlatsByRestaurant = (restaurantId: number): Plat[] => {
    return plats.value.filter((p) => p.restaurantId === restaurantId)
  }

  const createPlat = async (
    restaurantId: number,
    platData: CreateDishData
  ): Promise<ApiResponse<Plat>> => {
    try {
      const dish = await apiFetch<Plat>(
        `/restaurants/${restaurantId}/dishes`,
        {
          method: 'POST',
          body: platData
        }
      )

      return { success: true, data: dish }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la création'
      }
    }
  }

  const updatePlat = async (
    platId: number,
    platData: UpdateDishData
  ): Promise<ApiResponse<Plat>> => {
    try {
      const dish = await apiFetch<Plat>(`/dishes/${platId}`, {
        method: 'PUT',
        body: platData
      })

      return { success: true, data: dish }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la modification'
      }
    }
  }

  const deletePlat = async (platId: number): Promise<ApiResponse<void>> => {
    try {
      await apiFetch(`/dishes/${platId}`, {
        method: 'DELETE'
      })

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la suppression'
      }
    }
  }

  return {
    plats,
    pending: showSkeleton,
    error,
    fetchPlats,
    refresh,
    getPlatsByRestaurant,
    createPlat,
    updatePlat,
    deletePlat
  }
}
