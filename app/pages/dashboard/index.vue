<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-4xl font-bold uppercase text-primary">
      Mes Restaurants
    </h1>

    <div v-if="loading" class="text-gray-600">Chargement...</div>

    <div v-else-if="error" class="bg-red-50 p-3 text-red-600">
      {{ error }}
    </div>

    <div v-else-if="restaurants.length === 0" class="bg-white p-8 text-center shadow-[8px_8px_0_#f97316]">
      <p class="text-gray-600">Aucun restaurant assigné pour le moment.</p>
      <p class="mt-2 text-sm text-gray-500">
        Contactez un administrateur pour vous assigner un restaurant.
      </p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        class="bg-white p-6 shadow-[8px_8px_0_#f97316]"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ restaurant.nom }}</h2>
            <p class="text-gray-600">{{ restaurant.adresse }}, {{ restaurant.ville }}</p>
          </div>
          <button
            @click="toggleRestaurant(restaurant.id)"
            class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-6 py-2 text-lg font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
          >
            <span class="skew-x-6 italic">
              {{ expandedRestaurants.has(restaurant.id) ? 'Masquer' : 'Gérer les plats' }}
            </span>
          </button>
        </div>

        <div v-if="expandedRestaurants.has(restaurant.id)" class="border-t pt-4">
          <h3 class="mb-3 text-xl font-semibold">Plats du restaurant</h3>

          <div v-if="loadingPlats.has(restaurant.id)" class="text-gray-600">
            Chargement des plats...
          </div>

          <div v-else>
            <div class="mb-4 space-y-2">
              <div
                v-for="plat in getRestaurantPlats(restaurant.id)"
                :key="plat.id"
                class="flex items-center justify-between border-b border-gray-200 py-2"
              >
                <div>
                  <p class="font-semibold">{{ plat.nom }}</p>
                  <p class="text-sm text-gray-600">{{ plat.prix }}€ - {{ plat.categorie }}</p>
                  <span
                    class="inline-block rounded px-2 py-1 text-xs font-semibold"
                    :class="plat.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ plat.disponible ? 'Disponible' : 'Indisponible' }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="toggleDisponibilite(plat)"
                    class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    {{ plat.disponible ? 'Désactiver' : 'Activer' }}
                  </button>
                  <button
                    @click="deletePlat(plat.id, restaurant.id)"
                    class="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="showAddPlatForm(restaurant.id)"
              class="button-cta bg-primary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-6 py-2 text-lg font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
            >
              <span class="skew-x-6 italic">
                Ajouter un plat
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/types/restaurant'
import type { Plat } from '~/types/plat'

definePageMeta({
  middleware: 'restaurant-owner',
  layout: 'default'
})

const restaurants = ref<Restaurant[]>([])
const plats = ref<Plat[]>([])
const loading = ref(true)
const error = ref('')
const expandedRestaurants = ref(new Set<number>())
const loadingPlats = ref(new Map<number, boolean>())

const getRestaurantPlats = (restaurantId: number) => {
  return plats.value.filter(p => p.restaurant_id === restaurantId)
}

const fetchRestaurants = async () => {
  loading.value = true
  error.value = ''

  try {
    restaurants.value = await $fetch('/api/restaurants/mine')
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Erreur lors du chargement des restaurants'
  } finally {
    loading.value = false
  }
}

const fetchPlats = async (restaurantId: number) => {
  loadingPlats.value.set(restaurantId, true)

  try {
    const restaurantPlats = await $fetch<Plat[]>('/api/plats', {
      query: { restaurant_id: restaurantId }
    })

    plats.value = [
      ...plats.value.filter(p => p.restaurant_id !== restaurantId),
      ...restaurantPlats
    ]
  } catch (err: any) {
    console.error('Erreur chargement plats:', err)
  } finally {
    loadingPlats.value.set(restaurantId, false)
  }
}

const toggleRestaurant = (restaurantId: number) => {
  if (expandedRestaurants.value.has(restaurantId)) {
    expandedRestaurants.value.delete(restaurantId)
  } else {
    expandedRestaurants.value.add(restaurantId)
    if (!loadingPlats.value.has(restaurantId)) {
      fetchPlats(restaurantId)
    }
  }
}

const toggleDisponibilite = async (plat: Plat) => {
  try {
    await $fetch(`/api/plats/${plat.id}`, {
      method: 'PUT',
      body: {
        disponible: !plat.disponible
      }
    })

    const index = plats.value.findIndex(p => p.id === plat.id)
    if (index !== -1) {
      plats.value[index].disponible = !plats.value[index].disponible
    }
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erreur lors de la mise à jour')
  }
}

const deletePlat = async (platId: number, restaurantId: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
    return
  }

  try {
    await $fetch(`/api/plats/${platId}`, {
      method: 'DELETE'
    })

    plats.value = plats.value.filter(p => p.id !== platId)
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erreur lors de la suppression')
  }
}

const showAddPlatForm = (restaurantId: number) => {
  alert('Fonctionnalité à venir : formulaire d\'ajout de plat')
}

onMounted(() => {
  fetchRestaurants()
})
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 black;
}
</style>
