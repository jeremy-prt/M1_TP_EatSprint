import type { Restaurant } from "~/types/restaurant";

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

  const getRestaurantsByCategorie = (categorie: string) => {
    if (!restaurants.value) return [];
    return restaurants.value.filter((r) => r.categorie === categorie);
  };

  return {
    restaurants,
    pending,
    error,
    refresh,
    getRestaurantsByCategorie,
  };
};
