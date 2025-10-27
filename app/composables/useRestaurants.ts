import type { Restaurant } from "~/types/restaurant";

/**
 * Composable pour récupérer et gérer les restaurants côté public
 * Utilise useAsyncData pour SSR et caching automatique
 * @param simulateError - Pour tester la gestion d'erreur (dev only)
 */
export const useRestaurants = (simulateError = false) => {
  const queryParams = simulateError ? "?simulate-error=true" : "";

  const {
    data: restaurants,
    pending,
    error,
    refresh,
  } = useAsyncData<Restaurant[]>(
    "restaurants",
    () => $fetch(`/api/restaurants${queryParams}`),
    {
      // Cache les données pendant 10 minutes
      getCachedData: (key) =>
        useNuxtApp().payload.data[key] || useNuxtApp().static.data[key],

      // Stratégie de revalidation
      lazy: false,
      server: true,

      // Transformation des données
      transform: (data) => data || [],

      // En cas d'erreur, garde les anciennes données si disponibles
      default: () => [],
    },
  );

  // Utilise le délai pour éviter les flashs de skeleton sur connexion rapide
  const showSkeleton = useDelayedPending(pending, 200);

  /**
   * Filtre les restaurants par catégorie
   * @param categorie - Catégorie de restaurant (ex: "Japonais", "Italien")
   * @returns Liste des restaurants de la catégorie
   */
  const getRestaurantsByCategorie = (categorie: string) => {
    if (!restaurants.value) return [];
    return restaurants.value.filter((r) => r.categorie === categorie);
  };

  return {
    restaurants,
    pending: showSkeleton,
    error,
    refresh,
    getRestaurantsByCategorie,
  };
};
