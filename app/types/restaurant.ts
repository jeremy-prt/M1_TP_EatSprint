export interface Restaurant {
  id: number
  nom: string
  adresse: string
  ville: string
  categorie: string
  image: string
  created_at: string
  cuisine: string
  note: number
  nb_avis: number
  gamme_prix: string
  temps_livraison_min: number
  slug: string
  owner_id: number | null
}
