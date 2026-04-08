export type UserRole = 'CUSTOMER' | 'ADMIN' | 'RESTAURANT_OWNER'

export interface User {
  id: number
  email: string
  name: string
  address: string | null
  city: string | null
  zipCode: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  address?: string
  city?: string
  zipCode?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}
