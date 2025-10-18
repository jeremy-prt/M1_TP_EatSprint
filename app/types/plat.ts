export interface Plat {
  id: number
  slug: string
  nom: string
  prix: number
  description: string
  categorie: string
  restaurant_id: number
  calories: number
  temps_preparation_min: number
  vegetarien: boolean
  vegan: boolean
  epice: boolean
  allergenes: string | null
  disponible: boolean
  image: string
  created_at: string
}
