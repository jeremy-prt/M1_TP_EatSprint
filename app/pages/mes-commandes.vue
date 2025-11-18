<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-12">
    <div class="container mx-auto max-w-5xl px-6">
      <h1
        class="text-primary mb-8 text-center text-5xl font-extrabold uppercase md:text-6xl"
      >
        {{ $t('orders.title') }}
      </h1>

      <LazyOrderList
        hydrate-on-visible
        :orders="orderStore.allOrders"
        :loading="showSkeleton"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const orderStore = useOrderStore()

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const isLoading = computed(() => orderStore.isLoading)
const showSkeleton = useDelayedPending(isLoading, 200)

onMounted(async () => {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  }
})

useSeoMeta({
  title: () => t('pages.orders.title'),
  description: () => t('pages.orders.description'),
  ogTitle: () => t('pages.orders.ogTitle'),
  ogDescription: () => t('pages.orders.ogDescription'),
  ogImage: '/assets/logo_new.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
})
</script>
