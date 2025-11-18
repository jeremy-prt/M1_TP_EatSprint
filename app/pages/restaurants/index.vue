<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-8">
    <RestaurantSearchBar v-model="searchQuery" />

    <Transition name="fade" mode="out-in">
      <LazyRestaurantGrid v-if="searchQuery" :search-query="searchQuery" />

      <div v-else class="w-full pl-6">
        <div class="space-y-16">
          <RestaurantCategoryRow category-key="new" :priority="true" />
          <LazyRestaurantCategoryRow category-key="trending" />
          <LazyRestaurantCategoryRow category-key="budget" />
          <LazyRestaurantCategoryRow category-key="gourmet" />
        </div>
      </div>
    </Transition>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
