import type { Plat } from "~/types/plat";

export const usePlats = (restaurantId?: number | Ref<number | undefined>) => {
  const { apiFetch } = useApi();

  const resolvedId = computed(() =>
    typeof restaurantId === 'number' ? restaurantId : restaurantId?.value
  );

  const {
    data: plats,
    pending,
    error,
    refresh,
  } = useAsyncData<Plat[]>(
    `plats-${resolvedId.value || 'all'}`,
    async () => {
      const id = resolvedId.value;
      if (id) {
        const response = await apiFetch<{ data: Plat[] }>(`/restaurants/${id}/dishes?limit=100`);
        return response.data;
      }
      return [];
    },
    {
      lazy: false,
      server: false,
      transform: (data) => data || [],
      default: () => [],
      watch: [resolvedId],
    },
  );

  const showSkeleton = useDelayedPending(pending, 200);

  const getPlatsByRestaurant = (id: number) => {
    if (!plats.value) return [];
    return plats.value.filter((p) => p.restaurantId === id);
  };

  return {
    plats,
    pending: showSkeleton,
    error,
    refresh,
    getPlatsByRestaurant,
  };
};
