<template>
  <div class="py-12 text-center">
    <div class="flex flex-col items-center gap-4">
      <Icon name="mdi:alert-circle" size="64" class="text-red-600" />
      <p class="text-xl font-bold text-red-600">
        Erreur lors du chargement du plat
      </p>
      <button
        @click="$emit('retry')"
        class="bg-secondary hover:bg-primary -skew-x-6 cursor-pointer border-none px-6 py-3 text-lg font-bold text-white shadow-[3px_3px_0_black] transition-all hover:scale-105 active:scale-95"
      >
        <span class="skew-x-6">Réessayer</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  retry: []
}>()
</script>
