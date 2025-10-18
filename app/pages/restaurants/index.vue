<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <div class="w-full pl-6">
      <div class="space-y-16">
        <RestaurantCategoryRow categorie="Nouveau" />
        <RestaurantCategoryRow categorie="Tendance" />
        <RestaurantCategoryRow categorie="Petit prix" />
        <RestaurantCategoryRow categorie="Gastronomique" />
      </div>
    </div>
  </div>
</template>

<script setup>
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
