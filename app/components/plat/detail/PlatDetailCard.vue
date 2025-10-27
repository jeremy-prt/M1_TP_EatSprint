<template>
  <div class="px-8">
    <div
      class="relative -skew-x-6 overflow-hidden bg-white shadow-[6px_6px_0_#fb923c]"
    >
      <div class="grid skew-x-6 grid-cols-1 gap-0 lg:grid-cols-2">
        <!-- Image du plat -->
        <div class="relative -skew-x-6 overflow-hidden">
          <div class="absolute inset-0 bg-gray-400"></div>
          <NuxtImg
            :src="plat.image"
            :alt="plat.nom"
            width="600"
            height="800"
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/20"></div>

          <!-- Gradient et infos en bas à gauche -->
          <div
            class="absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t from-black/70 via-black/70 to-transparent"
          >
            <div class="absolute bottom-4 left-4 flex skew-x-6 gap-4">
              <div class="flex items-center gap-2">
                <Icon name="mdi:food" size="16" class="text-secondary" />
                <span class="text-sm font-semibold text-white">
                  {{ plat.categorie }}
                </span>
              </div>
              <div v-if="plat.vegetarien" class="flex items-center gap-2">
                <Icon name="mdi:leaf" size="16" class="text-green-400" />
                <span class="text-sm font-semibold text-white">
                  Végétarien
                </span>
              </div>
              <div v-if="plat.vegan" class="flex items-center gap-2">
                <Icon name="mdi:sprout" size="16" class="text-green-500" />
                <span class="text-sm font-semibold text-white"> Vegan </span>
              </div>
              <div v-if="plat.epice" class="flex items-center gap-2">
                <Icon name="mdi:chili-hot" size="16" class="text-red-400" />
                <span class="text-sm font-semibold text-white"> Épicé </span>
              </div>
              <div v-if="!plat.disponible" class="flex items-center gap-2">
                <Icon
                  name="mdi:close-circle"
                  size="16"
                  class="text-gray-400"
                />
                <span class="text-sm font-semibold text-white">
                  Indisponible
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations du plat -->
        <div class="flex flex-col gap-6 p-12 italic">
          <div>
            <h1 class="mb-2 text-4xl font-bold text-gray-800">
              {{ plat.nom }}
            </h1>
          </div>

          <p class="text-lg text-gray-700">{{ plat.description }}</p>

          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <Icon name="mdi:clock-outline" size="20" class="text-blue-400" />
              <span class="font-semibold"
                >{{ plat.temps_preparation_min }} min</span
              >
            </div>
            <div class="flex items-center gap-2">
              <Icon name="mdi:fire" size="20" class="text-orange-400" />
              <span class="font-semibold">{{ plat.calories }} cal</span>
            </div>
          </div>

          <div v-if="plat.allergenes" class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <Icon
                name="mdi:alert-circle"
                size="20"
                class="text-yellow-500"
              />
              <span class="font-bold text-gray-800">Allergènes</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(allergene, index) in plat.allergenes.split(';')"
                :key="index"
                class="inline-block -skew-x-6 bg-yellow-500 px-3 py-1 text-sm font-semibold text-black shadow-[2px_2px_0_black]"
              >
                <span class="skew-x-6">{{ allergene.trim() }}</span>
              </span>
            </div>
          </div>

          <div class="mt-auto space-y-6">
            <div class="border-primary/20 border-t pt-6">
              <span class="text-accent text-5xl font-extrabold">
                {{ plat.prix }}€
              </span>
            </div>

            <div class="flex flex-col gap-4">
              <div class="flex items-center">
                <button
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="bg-secondary hover:bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none shadow-[3px_3px_0_black] transition-all hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Diminuer la quantité"
                >
                  <Icon name="mdi:minus" size="24" class="text-white" />
                </button>
                <span class="w-16 text-center text-2xl font-bold">{{
                  quantity
                }}</span>
                <button
                  @click="incrementQuantity"
                  class="bg-secondary hover:bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none shadow-[3px_3px_0_black] transition-all hover:scale-110 active:scale-95"
                  aria-label="Augmenter la quantité"
                >
                  <Icon name="mdi:plus" size="24" class="text-white" />
                </button>
              </div>

              <UiButtonHighlight v-if="plat.disponible" @click="addToCart">
                Ajouter au panier
              </UiButtonHighlight>
              <div
                v-else
                class="button-cta bg-secondary inline-flex -skew-x-12 cursor-not-allowed items-center justify-center border-none px-8 py-3 text-2xl font-bold text-white opacity-50"
              >
                <span class="skew-x-12">Indisponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plat } from '~/types/plat'

interface Props {
  plat: Plat
}

const props = defineProps<Props>()

const quantity = ref(1)

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  console.log(`Ajout au panier : ${props.plat.nom} x ${quantity.value}`)
}
</script>
