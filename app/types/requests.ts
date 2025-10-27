/**
 * Types de requêtes API pour les endpoints du serveur
 */

/**
 * Requête de création d'un plat
 */
export interface CreatePlatRequest {
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

/**
 * Requête de mise à jour d'un plat (tous les champs optionnels)
 */
export interface UpdatePlatRequest {
  nom?: string
  prix?: number
  description?: string
  categorie?: string
  calories?: number
  temps_preparation_min?: number
  vegetarien?: boolean
  vegan?: boolean
  epice?: boolean
  allergenes?: string | null
  disponible?: boolean
  image?: string
}

/**
 * Requête de mise à jour d'un restaurant par le propriétaire
 */
export interface UpdateRestaurantOwnerRequest {
  nom?: string
  adresse?: string
  ville?: string
  categorie?: string
  image?: string
  cuisine?: string
  gamme_prix?: string
  temps_livraison_min?: number
}

/**
 * Requête de mise à jour d'un restaurant par l'admin (assignation propriétaire)
 */
export interface UpdateRestaurantAdminRequest {
  owner_id: number | null
}

/**
 * Requête de création d'un utilisateur par l'admin
 */
export interface CreateUserRequest {
  email: string
  password: string
  name: string
  adresse?: string
  ville?: string
  code_postal?: string
  role: 'restaurant_owner' | 'admin'
}

/**
 * Requête de mise à jour d'un utilisateur
 */
export interface UpdateUserRequest {
  name?: string
  email?: string
  adresse?: string | null
  ville?: string | null
  code_postal?: string | null
}
