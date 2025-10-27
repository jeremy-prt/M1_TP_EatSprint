<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <RestaurantSearchBar v-model="searchQuery" />

    <Transition name="fade" mode="out-in">
      <RestaurantGrid v-if="searchQuery" :search-query="searchQuery" />

      <div v-else class="w-full pl-6">
        <div class="space-y-16">
          <RestaurantCategoryRow categorie="Nouveau" />
          <RestaurantCategoryRow categorie="Tendance" />
          <RestaurantCategoryRow categorie="Petit prix" />
          <RestaurantCategoryRow categorie="Gastronomique" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref<string>('')

useSeoMeta({
  title: "Nos Restaurants - EatSprint",
  description:
    "Découvrez notre sélection de restaurants : nouveautés, tendances, petits prix et gastronomie. Commandez en ligne et profitez de la livraison rapide.",
  ogTitle: "Nos Restaurants - EatSprint",
  ogDescription:
    "Découvrez notre sélection de restaurants : nouveautés, tendances, petits prix et gastronomie.",
  ogImage: "/assets/logo_new.png",
  ogType: "website",
  twitterCard: "summary_large_image",
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
