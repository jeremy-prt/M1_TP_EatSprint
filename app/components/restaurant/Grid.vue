<template>
  <div class="w-full px-6">
    <div v-if="filteredRestaurants.length === 0" class="text-center">
      <p class="text-lg text-gray-500">Aucun restaurant trouvé</p>
    </div>

    <div
      v-else
      class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <NuxtLink
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.id"
        :to="`/restaurants/${restaurant.slug}/plats`"
        class="restaurant-card group relative -skew-x-12 cursor-pointer overflow-hidden shadow-[6px_6px_0_#fb923c] transition-all duration-150"
      >
        <div class="absolute inset-0 bg-gray-400"></div>

        <NuxtImg
          :src="restaurant.image"
          :alt="restaurant.nom"
          width="300"
          height="200"
          class="restaurant-image absolute inset-0 h-full w-full object-cover transition-transform duration-300"
          loading="lazy"
        />

        <div class="absolute inset-0 bg-black/20"></div>
        <div
          class="absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t from-black/70 via-black/70 to-transparent pt-20"
        >
          <div class="absolute bottom-9 left-4">
            <h3 class="text-text text-lg font-bold">
              {{ restaurant.nom }}
            </h3>
          </div>
          <div
            class="restaurant-ville absolute bottom-4 left-4 flex items-center gap-1"
          >
            <Icon name="mdi:map-marker" size="16" class="text-red-400" />
            <span class="text-sm font-semibold text-white">
              {{ restaurant.ville }}
            </span>
          </div>
          <div
            class="restaurant-note absolute right-4 bottom-4 flex items-center gap-1"
          >
            <Icon name="mdi:star" size="16" class="text-yellow-400" />
            <span class="text-sm font-semibold text-white">
              {{ restaurant.note }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/types/restaurant'

interface Props {
  searchQuery: string
}

const props = defineProps<Props>()

const { restaurants } = useRestaurants()

const filteredRestaurants = computed(() => {
  if (!restaurants.value || !props.searchQuery) return []

  const query = props.searchQuery.toLowerCase().trim()
  return restaurants.value.filter((r: Restaurant) => r.nom.toLowerCase().includes(query))
})
</script>

<style scoped>
.restaurant-card {
  height: 200px;
  background-color: white;
}

.restaurant-ville {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.restaurant-note {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.restaurant-card:hover .restaurant-ville {
  opacity: 1;
  transform: translateY(0);
}

.restaurant-card:hover .restaurant-note {
  opacity: 1;
  transform: translateY(0);
}

.restaurant-card:hover .restaurant-image {
  transform: scale(1.1);
}

.restaurant-card:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 #fb923c;
}
</style>
