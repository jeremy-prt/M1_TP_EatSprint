import type { User, UserRole } from '~/types/auth'
import type { ApiResponse } from '~/types/api'

interface CreateUserData {
  name: string
  email: string
  password: string
  adresse?: string | null
  ville?: string | null
  code_postal?: string | null
  restaurantId?: number | null
}

interface UpdateUserData {
  id: number
  name: string
  email: string
  adresse?: string | null
  ville?: string | null
  code_postal?: string | null
  restaurantId?: number | null
}

/**
 * Composable pour gérer les utilisateurs côté admin
 * Gère le CRUD des restaurateurs et la récupération de tous les users
 */
export const useAdminUsers = () => {
  const users = ref<User[]>([])
  const pending = ref(true)
  const error = ref('')

  // Utilise le délai pour éviter les flashs de skeleton sur connexion rapide
  const showSkeleton = useDelayedPending(pending, 200)

  const restaurantOwners = computed(() => {
    return users.value.filter((u) => u.role === 'restaurant_owner')
  })

  /**
   * Convertit le rôle technique en label français
   * @param role - Rôle de l'utilisateur
   * @returns Label traduit en français
   */
  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Administrateur'
      case 'restaurant_owner':
        return 'Restaurateur'
      case 'customer':
        return 'Client'
      default:
        return role
    }
  }

  /**
   * Récupère tous les utilisateurs depuis l'API admin
   */
  const fetchUsers = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      users.value = await $fetch<User[]>('/api/admin/users')
    } catch (err: any) {
      error.value =
        err.data?.statusMessage || 'Erreur lors du chargement des utilisateurs'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchUsers

  /**
   * Crée un nouvel utilisateur restaurateur
   * @param userData - Données du restaurateur à créer
   * @returns ApiResponse avec l'utilisateur créé
   */
  const createUser = async (userData: CreateUserData): Promise<ApiResponse<User>> => {
    try {
      const response = await $fetch<{ user: User }>('/api/admin/users', {
        method: 'POST',
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          adresse: userData.adresse || null,
          ville: userData.ville || null,
          code_postal: userData.code_postal || null,
          role: 'restaurant_owner',
        },
      })

      return { success: true, data: response.user }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la création',
      }
    }
  }

  /**
   * Met à jour les informations d'un utilisateur
   * @param userId - ID de l'utilisateur à modifier
   * @param userData - Données partielles à mettre à jour
   * @returns ApiResponse avec l'utilisateur modifié
   */
  const updateUser = async (userId: number, userData: Partial<UpdateUserData>): Promise<ApiResponse<User>> => {
    try {
      const response = await $fetch<{ user: User }>(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: {
          name: userData.name,
          email: userData.email,
          adresse: userData.adresse || null,
          ville: userData.ville || null,
          code_postal: userData.code_postal || null,
        },
      })

      return { success: true, data: response.user }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la modification',
      }
    }
  }

  /**
   * Supprime un utilisateur
   * @param userId - ID de l'utilisateur à supprimer
   * @returns ApiResponse indiquant le succès ou l'échec
   */
  const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
    try {
      await $fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      // Retirer l'utilisateur de la liste locale
      users.value = users.value.filter((u) => u.id !== userId)

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.statusMessage || 'Erreur lors de la suppression',
      }
    }
  }

  return {
    users,
    pending: showSkeleton,
    error,
    restaurantOwners,
    getRoleLabel,
    fetchUsers,
    refresh,
    createUser,
    updateUser,
    deleteUser,
  }
}
