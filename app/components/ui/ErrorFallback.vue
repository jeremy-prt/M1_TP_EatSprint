<template>
  <div class="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 p-8 text-center">
    <Icon
      name="mdi:alert-circle-outline"
      size="64"
      class="mb-4 text-accent"
    />
    <h3 class="mb-2 text-xl font-bold text-gray-900">{{ title }}</h3>
    <p class="mb-6 text-gray-600">{{ message }}</p>
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center gap-2 border-none px-6 py-3 font-bold text-white no-underline shadow-[4px_4px_0_black] transition-all duration-150 focus:outline-none"
    >
      <span class="flex skew-x-6 items-center gap-2 italic">
        <Icon name="mdi:refresh" size="20" />
        Réessayer
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Erreur de chargement',
  showRetry: true
})

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
