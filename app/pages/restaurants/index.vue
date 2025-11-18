<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <RestaurantSearchBar v-model="searchQuery" />

    <RestaurantGrid v-if="searchQuery" :search-query="searchQuery" />

    <div v-else class="w-full pl-6">
      <div class="space-y-16">
        <RestaurantCategoryRow category-key="new" :priority="true" />
        <RestaurantCategoryRow category-key="trending" />
        <RestaurantCategoryRow category-key="budget" />
        <RestaurantCategoryRow category-key="gourmet" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const searchQuery = ref<string>('')

useSeoMeta({
  title: () => t('pages.restaurants.title'),
  description: () => t('pages.restaurants.description'),
  ogTitle: () => t('pages.restaurants.ogTitle'),
  ogDescription: () => t('pages.restaurants.ogDescription'),
  ogImage: "/assets/logo_new.png",
  ogType: "website",
  twitterCard: "summary_large_image",
});

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
});
</script>
