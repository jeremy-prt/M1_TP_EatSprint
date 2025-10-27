<template>
  <div class="-skew-x-3 flex h-full flex-col overflow-hidden bg-white shadow-[8px_8px_0_#fb923c]">
    <div class="border-b-2 border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h2 class="text-secondary text-2xl font-bold">
          Informations du Restaurant
        </h2>
        <button
          @click="$emit('edit')"
          class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center gap-2 border-none px-4 py-2 text-base font-bold text-white no-underline shadow-[4px_4px_0_black] transition-all duration-150 focus:outline-none"
        >
          <span class="flex skew-x-6 items-center gap-2 italic">
            <Icon name="mdi:pencil" size="20" />
            Éditer
          </span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="mb-6">
        <NuxtImg
          :src="restaurant.image"
          :alt="restaurant.nom"
          width="400"
          height="200"
          class="h-48 w-full -skew-x-3 object-cover shadow-[4px_4px_0_#fb923c]"
        />
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Nom
          </h3>
          <p class="text-lg text-gray-600">{{ restaurant.nom }}</p>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Adresse
          </h3>
          <p class="text-lg text-gray-600">{{ restaurant.adresse }}</p>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Ville
          </h3>
          <p class="text-lg text-gray-600">{{ restaurant.ville }}</p>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Catégorie
          </h3>
          <p class="text-lg text-gray-600">{{ restaurant.categorie }}</p>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Cuisine
          </h3>
          <p class="text-lg text-gray-600">{{ restaurant.cuisine }}</p>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Temps de livraison
          </h3>
          <p class="text-lg text-gray-600">
            {{ restaurant.temps_livraison_min }} min
          </p>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Note
          </h3>
          <div class="flex items-center gap-1">
            <Icon name="mdi:star" size="20" class="text-yellow-400" />
            <p class="text-lg font-semibold text-gray-600">
              {{ restaurant.note }}/5
            </p>
            <span class="text-sm text-gray-500"
              >({{ restaurant.nb_avis }} avis)</span
            >
          </div>
        </div>

        <div>
          <h3 class="mb-1 text-sm font-bold uppercase text-gray-900">
            Gamme de prix
          </h3>
          <div class="flex items-center gap-2">
            <Icon name="mdi:cash-multiple" size="20" :class="priceRangeColor" />
            <span
              class="inline-block rounded px-3 py-1 text-sm font-semibold"
              :class="priceRangeClass"
            >
              {{ priceRangeLabel }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from "~/types/restaurant";

interface Props {
  restaurant: Restaurant;
}

const props = defineProps<Props>();

defineEmits<{
  edit: [];
}>();

const priceRangeLabel = computed(() => {
  const count = props.restaurant.gamme_prix.length;
  switch (count) {
    case 1:
      return "Bon marché";
    case 2:
      return "Modéré";
    case 3:
      return "Cher";
    case 4:
      return "Très cher";
    default:
      return props.restaurant.gamme_prix;
  }
});

const priceRangeClass = computed(() => {
  const count = props.restaurant.gamme_prix.length;
  switch (count) {
    case 1:
      return "bg-green-100 text-green-800";
    case 2:
      return "bg-blue-100 text-blue-800";
    case 3:
      return "bg-orange-100 text-orange-800";
    case 4:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

const priceRangeColor = computed(() => {
  const count = props.restaurant.gamme_prix.length;
  switch (count) {
    case 1:
      return "text-green-600";
    case 2:
      return "text-blue-600";
    case 3:
      return "text-orange-600";
    case 4:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
});
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
