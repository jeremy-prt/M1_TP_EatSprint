<template>
  <div class="mb-8">
    <div class="mb-4 flex items-center justify-between pr-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ categorie }}</h2>
    </div>

    <div class="overflow-hidden pr-6">
      <div
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-8 text-center"
      >
        <Icon name="mdi:alert-circle" size="48" class="mb-4 text-red-500" />
        <h3 class="mb-2 text-lg font-bold text-red-700">
          Erreur de chargement
        </h3>
        <p class="mb-4 text-sm text-red-600">
          Impossible de charger les restaurants pour cette catégorie.
        </p>
        <button
          @click="$emit('retry')"
          class="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
        >
          <Icon name="mdi:refresh" size="20" />
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categorie: {
    type: String,
    required: true,
  },
});

defineEmits(["retry"]);
</script>
