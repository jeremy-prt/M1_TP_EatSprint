import type { User, UserRole } from '~/types/auth'

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

interface ApiResponse<T> {
  success: boolean
  error?: string
  data?: T
}

export const useAdminUsers = () => {
  const users = ref<User[]>([])
  const pending = ref(true)
  const error = ref('')

  const restaurantOwners = computed(() => {
    return users.value.filter((u) => u.role === 'restaurant_owner')
  })

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

  return {
    users,
    pending,
    error,
    restaurantOwners,
    getRoleLabel,
    fetchUsers,
    refresh,
    createUser,
    updateUser,
  }
}
