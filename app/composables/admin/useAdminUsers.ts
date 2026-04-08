import type { User, UserRole } from '~/types/auth'
import type { ApiResponse } from '~/types/api'

interface CreateUserData {
  name: string
  email: string
  password: string
  address?: string | null
  city?: string | null
  zipCode?: string | null
}

interface UpdateUserData {
  name?: string
  email?: string
  address?: string | null
  city?: string | null
  zipCode?: string | null
}

export const useAdminUsers = () => {
  const { apiFetch } = useApi()
  const users = ref<User[]>([])
  const pending = ref(true)
  const error = ref('')

  const showSkeleton = useDelayedPending(pending, 200)

  const restaurantOwners = computed(() => {
    return users.value.filter((u) => u.role === 'RESTAURANT_OWNER')
  })

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur'
      case 'RESTAURANT_OWNER':
        return 'Restaurateur'
      case 'CUSTOMER':
        return 'Client'
      default:
        return role
    }
  }

  const fetchUsers = async (): Promise<void> => {
    pending.value = true
    error.value = ''

    try {
      users.value = await apiFetch<User[]>('/admin/users')
    } catch (err: any) {
      error.value = err.data?.detail || 'Erreur lors du chargement des utilisateurs'
    } finally {
      pending.value = false
    }
  }

  const refresh = fetchUsers

  const createUser = async (userData: CreateUserData): Promise<ApiResponse<User>> => {
    try {
      const response = await apiFetch<{ user: User }>('/admin/users', {
        method: 'POST',
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          address: userData.address || null,
          city: userData.city || null,
          zipCode: userData.zipCode || null,
          role: 'RESTAURANT_OWNER',
        },
      })

      return { success: true, data: response.user }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la création',
      }
    }
  }

  const updateUser = async (userId: number, userData: UpdateUserData): Promise<ApiResponse<User>> => {
    try {
      const response = await apiFetch<{ user: User }>(`/admin/users/${userId}`, {
        method: 'PUT',
        body: userData,
      })

      return { success: true, data: response.user }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la modification',
      }
    }
  }

  const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
    try {
      await apiFetch(`/admin/users/${userId}`, {
        method: 'DELETE',
      })

      users.value = users.value.filter((u) => u.id !== userId)

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.data?.detail || 'Erreur lors de la suppression',
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
