<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <div class="w-full px-6">
      <PlatBreadcrumb
        :restaurant-name="restaurant?.nom"
        :restaurant-slug="slug"
        :plat-name="plat?.nom"
      />

      <PlatDetailSkeleton v-if="pending" />

      <PlatDetailError v-else-if="error" @retry="refresh" />

      <PlatDetailCard v-else-if="plat" :plat="plat" />

      <div v-else class="py-12 text-center">
        <p class="text-xl text-gray-500">Plat introuvable</p>
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

// Récupération du restaurant pour le breadcrumb
const { restaurants } = useRestaurants()
const restaurant = computed<Restaurant | undefined>(() => {
  return restaurants.value?.find((r) => r.slug === slug)
})

// Récupération du plat
const { plats: allPlats, pending, error, refresh } = usePlats()
const plat = computed<Plat | null | undefined>(() => {
  if (!allPlats.value) return null
  return allPlats.value.find((p) => p.slug === platSlug)
})

// SEO dynamique avec Schema.org
useSeoPlat(plat, restaurant)
</script>
