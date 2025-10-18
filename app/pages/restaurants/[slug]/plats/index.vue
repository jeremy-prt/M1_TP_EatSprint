<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <div class="w-full pl-6">
      <PlatBreadcrumb :restaurant-name="restaurant?.nom" />

      <PlatGrid
        :plats="plats"
        :pending="pending"
        :error="error"
        @retry="refresh"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();
const slug = route.params.slug;

// Récupération du restaurant pour le breadcrumb
const { restaurants } = useRestaurants();
const restaurant = computed(() => {
  return restaurants.value?.find((r) => r.slug === slug);
});

// Récupération de tous les plats
const { pending, error, refresh, getPlatsByRestaurant } = usePlats();

// Filtrage des plats du restaurant actuel
const plats = computed(() => {
  if (!restaurant.value?.id) return [];
  return getPlatsByRestaurant(restaurant.value.id);
});

// SEO dynamique
useSeoRestaurant(restaurant);
</script>
