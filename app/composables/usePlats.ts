import type { Plat } from "~/types/plat";

/**
 * Composable pour récupérer et gérer les plats côté public
 * Utilise useAsyncData pour SSR et caching automatique
 * @param restaurantId - ID du restaurant pour filtrer les plats (optionnel)
 * @param simulateError - Pour tester la gestion d'erreur (dev only)
 */
export const usePlats = (restaurantId?: number, simulateError = false) => {
  const queryParams = new URLSearchParams();

  if (simulateError) {
    queryParams.append("simulate-error", "true");
  }

  if (restaurantId) {
    queryParams.append("restaurant_id", restaurantId.toString());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const {
    data: plats,
    pending,
    error,
    refresh,
  } = useAsyncData<Plat[]>(
    `plats-${restaurantId || 'all'}`,
    () => $fetch(`/api/plats${queryString}`),
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
   * Filtre les plats par restaurant
   * @param restaurantId - ID du restaurant
   * @returns Liste des plats du restaurant
   */
  const getPlatsByRestaurant = (restaurantId: number) => {
    if (!plats.value) return [];
    return plats.value.filter((p) => p.restaurant_id === restaurantId);
  };

  return {
    plats,
    pending: showSkeleton,
    error,
    refresh,
    getPlatsByRestaurant,
  };
};
