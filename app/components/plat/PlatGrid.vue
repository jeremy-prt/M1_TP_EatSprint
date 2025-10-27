<template>
  <!-- Affichage du skeleton pendant le chargement -->
  <PlatSkeleton v-if="pending" />

  <!-- Affichage de l'erreur avec bouton retry -->
  <PlatError v-else-if="error" @retry="$emit('retry')" />

  <!-- Affichage normal des plats -->
  <div v-else>
    <div v-if="plats.length === 0" class="py-12 text-center">
      <p class="text-xl text-gray-500">
        Aucun plat disponible pour ce restaurant
      </p>
    </div>

    <div v-else class="space-y-12">
      <div v-for="(platsCategorie, categorie) in platsGroupes" :key="categorie">
        <h2 class="text-accent relative left-12 mb-6 text-2xl font-bold italic">
          {{ categorie }}
        </h2>

        <div class="pr-6">
          <div
            class="grid grid-cols-1 gap-6 pl-5 md:grid-cols-3 lg:grid-cols-4"
          >
            <NuxtLink
              v-for="plat in platsCategorie"
              :key="plat.id"
              :to="`/restaurants/${restaurantSlug}/plats/${plat.slug}`"
              class="plat-card group relative -skew-x-12 cursor-pointer overflow-hidden shadow-[6px_6px_0_#fb923c] transition-all duration-150"
            >
              <div class="absolute inset-0 bg-gray-400"></div>

              <NuxtImg
                :src="plat.image"
                :alt="plat.nom"
                width="300"
                height="200"
                class="plat-image absolute inset-0 h-full w-full object-cover transition-transform duration-300"
                loading="lazy"
              />

              <div class="absolute inset-0 bg-black/20"></div>

              <div
                class="absolute top-0 right-0 left-0 h-1/3 bg-gradient-to-b from-black/30 via-black/10 to-transparent"
              ></div>

              <div class="absolute top-4 left-4">
                <span
                  class="text-text bg-black/50 px-2 py-1 text-base font-bold"
                >
                  {{ plat.prix }}€
                </span>
              </div>

              <div
                class="absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t from-black/70 via-black/70 to-transparent pt-20"
              >
                <div class="absolute bottom-9 left-4">
                  <h3 class="text-text text-lg font-bold">
                    {{ plat.nom }}
                  </h3>
                </div>
                <div
                  class="plat-temps absolute bottom-4 left-4 flex items-center gap-1"
                >
                  <Icon
                    name="mdi:clock-outline"
                    size="16"
                    class="text-blue-400"
                  />
                  <span class="text-sm font-semibold text-white">
                    {{ plat.temps_preparation_min }} min
                  </span>
                </div>
                <div
                  class="plat-calories absolute right-4 bottom-4 flex items-center gap-1"
                >
                  <Icon name="mdi:fire" size="16" class="text-orange-400" />
                  <span class="text-sm font-semibold text-white">
                    {{ plat.calories }} cal
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plat } from '~/types/plat'

interface Props {
  plats: Plat[]
  pending?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pending: false,
  error: false
})

defineEmits<{
  retry: []
}>()

const route = useRoute()
const restaurantSlug = route.params.slug

const platsGroupes = computed(() => {
  const groupes: Record<string, Plat[]> = {}

  props.plats.forEach((plat) => {
    if (!groupes[plat.categorie]) {
      groupes[plat.categorie] = []
    }
    groupes[plat.categorie].push(plat)
  })

  return groupes
})
</script>

<style scoped>
.plat-card {
  background-color: white;
  height: 200px;
}

.plat-temps {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.plat-calories {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.plat-card:hover .plat-temps {
  opacity: 1;
  transform: translateY(0);
}

.plat-card:hover .plat-calories {
  opacity: 1;
  transform: translateY(0);
}

.plat-card:hover .plat-image {
  transform: scale(1.1);
}

.plat-card:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 #fb923c;
}
</style>
