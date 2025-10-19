export type UserRole = 'customer' | 'admin' | 'restaurant_owner'

export interface User {
  id: number
  email: string
  name: string
  adresse: string | null
  ville: string | null
  code_postal: string | null
  role: UserRole
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  adresse?: string
  ville?: string
  code_postal?: string
}

export interface AuthResponse {
  user: User
}
