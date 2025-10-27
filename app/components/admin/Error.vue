<template>
  <div
    class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-8 text-center"
  >
    <Icon name="mdi:alert-circle" size="48" class="mb-4 text-red-500" />
    <h3 class="mb-2 text-lg font-bold text-red-700">
      {{ title || "Erreur" }}
    </h3>
    <p class="mb-4 text-sm text-red-600">
      {{ message }}
    </p>
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
    >
      <Icon name="mdi:refresh" size="20" />
      Réessayer
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
  title: 'Erreur',
  showRetry: true
})

defineEmits<{
  'retry': []
}>()
</script>
