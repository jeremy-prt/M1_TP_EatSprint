import type { Restaurant } from "~/types/restaurant";

export const useRestaurants = () => {
  const { apiFetch } = useApi();

  const {
    data: restaurants,
    pending,
    error,
    refresh,
  } = useAsyncData<Restaurant[]>(
    "restaurants",
    async () => {
      const response = await apiFetch<{ data: Restaurant[] }>("/restaurants?limit=100");
      return response.data;
    },
    {
      getCachedData: (key) =>
        useNuxtApp().payload.data[key] || useNuxtApp().static.data[key],
      lazy: false,
      server: false,
      transform: (data) => data || [],
      default: () => [],
    },
  );

  const showSkeleton = useDelayedPending(pending, 200);

  const getRestaurantsByCategory = (category: string) => {
    if (!restaurants.value) return [];
    return restaurants.value.filter((r) => r.category === category);
  };

  return {
    restaurants,
    pending: showSkeleton,
    error,
    refresh,
    getRestaurantsByCategory,
    getRestaurantsByCategorie: getRestaurantsByCategory,
  };
};
