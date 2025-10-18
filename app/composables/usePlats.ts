import type { Plat } from "~/types/plat";

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

  const getPlatsByRestaurant = (restaurantId: number) => {
    if (!plats.value) return [];
    return plats.value.filter((p) => p.restaurant_id === restaurantId);
  };

  return {
    plats,
    pending,
    error,
    refresh,
    getPlatsByRestaurant,
  };
};
