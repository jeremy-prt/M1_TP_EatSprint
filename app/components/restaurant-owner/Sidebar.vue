<template>
  <div
    class="flex h-[calc(100vh-var(--spacing-header)-4rem)] w-64 -skew-x-3 flex-col bg-white shadow-[8px_8px_0_#fb923c]"
  >
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-4">
        <li v-for="restaurant in restaurants" :key="restaurant.id">
          <button
            @click="$emit('select', restaurant)"
            class="restaurant-button flex w-full -skew-x-3 cursor-pointer items-center gap-3 px-4 py-3 text-left shadow-[4px_4px_0_black] transition-all"
            :class="
              selectedRestaurantId === restaurant.id
                ? 'bg-secondary text-white'
                : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
            "
          >
            <Icon name="mdi:silverware-fork-knife" size="24" />
            <div class="flex-1 overflow-hidden">
              <span class="block truncate font-medium">{{
                restaurant.nom
              }}</span>
              <span class="block truncate text-xs opacity-75">{{
                restaurant.ville
              }}</span>
            </div>
          </button>
        </li>
      </ul>

      <div
        v-if="restaurants.length === 0 && !loading"
        class="px-4 py-8 text-center text-sm text-gray-500"
      >
        Aucun restaurant assigné
      </div>

      <div v-if="loading" class="space-y-2 p-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-16 animate-pulse rounded bg-gray-200"
        ></div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from "~/types/restaurant";

interface Props {
  restaurants: Restaurant[];
  selectedRestaurantId: number | null;
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  select: [restaurant: Restaurant];
}>();
</script>

<style scoped>
.restaurant-button:active {
  transform: skewX(-6deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
