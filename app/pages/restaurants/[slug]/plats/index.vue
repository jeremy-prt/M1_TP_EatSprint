<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <div class="w-full pl-6">
      <PlatBreadcrumb :restaurant-name="restaurant?.name" />

      <PlatGrid
        :plats="plats || []"
        :pending="pending"
        :error="!!error"
        @retry="refresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/types/restaurant'

const route = useRoute()
const slug = route.params.slug as string

const { restaurants } = useRestaurants()
const restaurant = computed<Restaurant | undefined>(() => {
  return restaurants.value?.find((r) => r.slug === slug)
})

const restaurantId = computed(() => restaurant.value?.id)

const { plats, pending, error, refresh } = usePlats(restaurantId)

useSeoRestaurant(restaurant)
</script>
