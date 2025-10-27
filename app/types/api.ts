/**
 * Interface générique pour les réponses d'API CRUD
 * Utilisée dans tous les composables pour uniformiser les retours
 */
export interface ApiResponse<T> {
  success: boolean
  error?: string
  data?: T
}
