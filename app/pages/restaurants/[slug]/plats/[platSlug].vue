<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <div class="w-full px-6">
      <PlatBreadcrumb
        :restaurant-name="restaurant?.name"
        :restaurant-slug="slug"
        :plat-name="plat?.name"
      />

      <PlatDetailSkeleton v-if="pending" />

      <PlatDetailError v-else-if="error" @retry="refresh" />

      <PlatDetailCard v-else-if="plat" :plat="plat" />

      <div v-else class="py-12 text-center">
        <p class="text-xl text-gray-500">{{ $t('plats.detail.notFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/types/restaurant'
import type { Plat } from '~/types/plat'

const route = useRoute()
const slug = route.params.slug as string
const platSlug = route.params.platSlug as string

const { restaurants } = useRestaurants()
const restaurant = computed<Restaurant | undefined>(() => {
  return restaurants.value?.find((r) => r.slug === slug)
})

const restaurantId = computed(() => restaurant.value?.id)

const { plats: allPlats, pending, error, refresh } = usePlats(restaurantId)
const plat = computed<Plat | null | undefined>(() => {
  if (!allPlats.value) return null
  return allPlats.value.find((p) => p.slug === platSlug)
})

useSeoPlat(plat, restaurant)
</script>
