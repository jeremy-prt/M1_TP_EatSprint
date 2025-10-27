<template>
  <div class="py-12 text-center">
    <Icon name="mdi:alert-circle" size="48" class="mb-4 text-red-500" />
    <p class="mb-4 text-xl text-red-600">
      Erreur lors du chargement des plats
    </p>
    <button
      @click="$emit('retry')"
      class="bg-secondary hover:bg-primary rounded-lg px-6 py-3 font-bold text-white transition-colors"
    >
      Réessayer
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  retry: []
}>()
</script>
