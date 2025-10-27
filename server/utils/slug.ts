/**
 * Génère un slug URL-friendly à partir d'un texte
 * @param text - Le texte à convertir en slug
 * @returns Le slug généré (minuscules, sans accents, avec tirets)
 * @example
 * generateSlug("Café Parisien") // retourne "cafe-parisien"
 * generateSlug("Restaurant d'été") // retourne "restaurant-d-ete"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
