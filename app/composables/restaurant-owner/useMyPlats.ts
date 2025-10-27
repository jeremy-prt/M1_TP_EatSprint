import type { Plat } from '~/types/plat'
import type { ApiResponse } from '~/types/api'

interface CreatePlatData {
  nom: string
  prix: number
  description: string
  categorie: string
  calories: number
  temps_preparation_min: number
  vegetarien: boolean
  vegan: boolean
  epice: boolean
  allergenes: string | null
  disponible: boolean
  image: string
}

interface UpdatePlatData extends Partial<CreatePlatData> {}

/**
 * Composable pour gérer les plats des restaurants du restaurateur connecté
 * Gère le CRUD complet des plats avec filtrage par restaurant
 */
export const useMyPlats = () => {
  const plats = ref<Plat[]>([])
  const pending = ref(true)
  const error = ref('')

  // Utilise le délai pour éviter les flashs de skeleton sur connexion rapide
  const showSkeleton = useDelayedPending(pending, 200)

  /**
   * Récupère tous les plats des restaurants du restaurateur
   */
  const fetchPlats = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      plats.value = await $fetch<Plat[]>('/api/plats')
    } catch (err: any) {
      error.value =
        err.data?.statusMessage || 'Erreur lors du chargement des plats'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchPlats

  /**
   * Filtre les plats par restaurant
   * @param restaurantId - ID du restaurant
   * @returns Liste des plats du restaurant
   */
  const getPlatsByRestaurant = (restaurantId: number): Plat[] => {
    return plats.value.filter((p) => p.restaurant_id === restaurantId)
  }

  /**
   * Crée un nouveau plat pour un restaurant
   * @param restaurantId - ID du restaurant parent
   * @param platData - Données du plat à créer
   * @returns ApiResponse avec le plat créé
   */
  const createPlat = async (
    restaurantId: number,
    platData: CreatePlatData
  ): Promise<ApiResponse<Plat>> => {
    try {
      const response = await $fetch<{ plat: Plat }>(
        `/api/restaurants/${restaurantId}/plats`,
        {
          method: 'POST',
          body: platData
        }
      )

      return { success: true, data: response.plat }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la création'
      }
    }
  }

  /**
   * Met à jour un plat existant
   * @param platId - ID du plat à modifier
   * @param platData - Données partielles à mettre à jour
   * @returns ApiResponse avec le plat modifié
   */
  const updatePlat = async (
    platId: number,
    platData: UpdatePlatData
  ): Promise<ApiResponse<Plat>> => {
    try {
      const response = await $fetch<{ plat: Plat }>(`/api/plats/${platId}`, {
        method: 'PUT',
        body: platData
      })

      return { success: true, data: response.plat }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la modification'
      }
    }
  }

  /**
   * Supprime un plat
   * @param platId - ID du plat à supprimer
   * @returns ApiResponse sans données
   */
  const deletePlat = async (platId: number): Promise<ApiResponse<void>> => {
    try {
      await $fetch(`/api/plats/${platId}`, {
        method: 'DELETE'
      })

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la suppression'
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
