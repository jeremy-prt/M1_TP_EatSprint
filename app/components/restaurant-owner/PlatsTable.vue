<template>
  <RestaurantOwnerPlatsTableSkeleton v-if="loading" />

  <UiErrorFallback
    v-else-if="error"
    :message="error"
    title="Erreur de chargement des plats"
    @retry="$emit('retry')"
  />

  <div v-else class="-skew-x-3 flex h-full flex-col overflow-hidden bg-white shadow-[8px_8px_0_#fb923c]">
    <div class="border-b-2 border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h2 class="text-secondary text-2xl font-bold">Mes Plats</h2>
        <button
          @click="$emit('add')"
          class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center gap-2 border-none px-4 py-2 text-base font-bold text-white no-underline shadow-[4px_4px_0_black] transition-all duration-150 focus:outline-none"
        >
          <span class="flex skew-x-6 items-center gap-2 italic">
            <Icon name="mdi:plus" size="20" />
            Ajouter un plat
          </span>
        </button>
      </div>
    </div>

    <div v-if="plats.length === 0" class="flex flex-1 items-center justify-center px-6 py-12 text-center text-gray-500">
      Aucun plat pour ce restaurant
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-bold uppercase text-gray-700">
              Nom
            </th>
            <th class="px-6 py-3 text-left text-sm font-bold uppercase text-gray-700">
              Prix
            </th>
            <th class="px-6 py-3 text-left text-sm font-bold uppercase text-gray-700">
              Catégorie
            </th>
            <th class="px-6 py-3 text-center text-sm font-bold uppercase text-gray-700">
              Disponible
            </th>
            <th class="px-6 py-3 text-right text-sm font-bold uppercase text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="plat in plats"
            :key="plat.id"
            class="transition-colors hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <NuxtImg
                  :src="plat.image"
                  :alt="plat.nom"
                  width="50"
                  height="50"
                  class="h-12 w-12 rounded object-cover"
                />
                <div>
                  <p class="font-semibold text-gray-900">{{ plat.nom }}</p>
                  <p class="text-sm text-gray-500">{{ plat.description.substring(0, 50) }}...</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-gray-900">{{ plat.prix }}€</p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-block rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                {{ plat.categorie }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span
                class="inline-block rounded px-3 py-1 text-xs font-semibold"
                :class="
                  plat.disponible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ plat.disponible ? 'Oui' : 'Non' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="$emit('edit', plat)"
                  class="bg-secondary inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-white shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
                >
                  <Icon name="mdi:pencil" size="18" />
                </button>
                <button
                  @click="$emit('delete', plat)"
                  class="inline-flex cursor-pointer items-center justify-center rounded-full bg-red-500 p-2 text-white shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
                >
                  <Icon name="mdi:delete" size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plat } from '~/types/plat'

interface Props {
  plats: Plat[]
  loading?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
})

defineEmits<{
  'add': []
  'edit': [plat: Plat]
  'delete': [plat: Plat]
  'retry': []
}>()
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
