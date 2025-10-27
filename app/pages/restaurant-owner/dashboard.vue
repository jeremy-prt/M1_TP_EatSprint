<template>
  <div class="p-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex gap-6">
        <RestaurantOwnerSidebarSkeleton v-if="pendingRestaurants" />
        <RestaurantOwnerSidebar
          v-else
          :restaurants="restaurants"
          :selected-restaurant-id="selectedRestaurant?.id || null"
          :loading="pendingRestaurants"
          @select="handleSelectRestaurant"
        />

        <div class="flex-1">
          <UiErrorFallback
            v-if="errorRestaurants && !pendingRestaurants"
            :message="errorRestaurants"
            title="Erreur de chargement"
            @retry="fetchMyRestaurants"
          />

          <div
            v-else-if="!selectedRestaurant && !pendingRestaurants"
            class="flex h-[calc(100vh-var(--spacing-header)-4rem)] items-center justify-center text-gray-500"
          >
            <div class="text-center">
              <Icon
                name="mdi:silverware-fork-knife"
                size="64"
                class="mx-auto mb-4 text-gray-300"
              />
              <p class="text-xl font-medium">
                Sélectionnez l'un de vos restaurants pour commencer
              </p>
            </div>
          </div>

          <div
            v-else-if="selectedRestaurant"
            class="flex h-[calc(100vh-var(--spacing-header)-4rem)] flex-col"
          >
            <div class="flex gap-4 pb-4 pl-5">
              <button
                @click="activeTab = 'info'"
                class="tab-button -skew-x-3 cursor-pointer px-4 py-2 font-medium shadow-[4px_4px_0_black] transition-all"
                :class="
                  activeTab === 'info'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                "
              >
                Informations
              </button>
              <button
                @click="activeTab = 'plats'"
                class="tab-button -skew-x-3 cursor-pointer px-4 py-2 font-medium shadow-[4px_4px_0_black] transition-all"
                :class="
                  activeTab === 'plats'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                "
              >
                Mes Plats
              </button>
            </div>

            <div class="flex-1">
              <RestaurantOwnerRestaurantInfo
                v-if="activeTab === 'info'"
                :restaurant="selectedRestaurant"
                @edit="openRestaurantModal"
              />

              <RestaurantOwnerPlatsTable
                v-if="activeTab === 'plats'"
                :plats="currentRestaurantPlats"
                :loading="pendingPlats"
                :error="errorPlats"
                @add="openAddPlatModal"
                @edit="openEditPlatModal"
                @delete="handleDeletePlat"
                @retry="fetchPlats"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <RestaurantOwnerRestaurantModal
      v-model="showRestaurantModal"
      :restaurant="selectedRestaurant"
      @submit="handleSubmitRestaurant"
    />

    <RestaurantOwnerPlatModal
      v-model="showPlatModal"
      :plat="selectedPlat"
      @submit="handleSubmitPlat"
    />
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from "~/types/restaurant";
import type { Plat } from "~/types/plat";
import { useMyRestaurants } from "~/composables/restaurant-owner/useMyRestaurants";
import { useMyPlats } from "~/composables/restaurant-owner/useMyPlats";
import { useToast } from "~/composables/useToast";

definePageMeta({
  middleware: "restaurant-owner",
  layout: "default",
});

const {
  restaurants,
  pending: pendingRestaurants,
  error: errorRestaurants,
  fetchMyRestaurants,
  updateRestaurant,
} = useMyRestaurants();

const {
  plats,
  pending: pendingPlats,
  error: errorPlats,
  fetchPlats,
  getPlatsByRestaurant,
  createPlat,
  updatePlat,
  deletePlat,
} = useMyPlats();

const toast = useToast();
const selectedRestaurant = ref<Restaurant | null>(null);
const activeTab = ref<"info" | "plats">("info");
const showRestaurantModal = ref(false);
const showPlatModal = ref(false);
const selectedPlat = ref<Plat | null>(null);

const currentRestaurantPlats = computed(() => {
  if (!selectedRestaurant.value) return [];
  return getPlatsByRestaurant(selectedRestaurant.value.id);
});

const handleSelectRestaurant = (restaurant: Restaurant) => {
  selectedRestaurant.value = restaurant;
  activeTab.value = "info";
};

const openRestaurantModal = () => {
  showRestaurantModal.value = true;
};

const openAddPlatModal = () => {
  selectedPlat.value = null;
  showPlatModal.value = true;
};

const openEditPlatModal = (plat: Plat) => {
  selectedPlat.value = plat;
  showPlatModal.value = true;
};

const handleSubmitRestaurant = async (data: any) => {
  if (!selectedRestaurant.value) return;

  const result = await updateRestaurant(selectedRestaurant.value.id, data);

  if (result.success && result.data) {
    const index = restaurants.value.findIndex(
      (r) => r.id === selectedRestaurant.value!.id,
    );
    if (index !== -1) {
      restaurants.value[index] = result.data;
      selectedRestaurant.value = result.data;
    }

    showRestaurantModal.value = false;
    toast.success("Restaurant modifié avec succès");
  } else {
    toast.error(result.error || "Une erreur est survenue");
  }
};

const handleSubmitPlat = async (data: any) => {
  if (!selectedRestaurant.value) return;

  let result;
  const isEdit = !!data.id;

  if (isEdit) {
    result = await updatePlat(data.id, data);
  } else {
    result = await createPlat(selectedRestaurant.value.id, data);
  }

  if (result.success && result.data) {
    if (isEdit) {
      const index = plats.value.findIndex((p) => p.id === data.id);
      if (index !== -1) {
        plats.value[index] = result.data;
      }
    } else {
      plats.value.push(result.data);
    }

    showPlatModal.value = false;
    toast.success(
      isEdit ? "Plat modifié avec succès" : "Plat créé avec succès",
    );
  } else {
    toast.error(result.error || "Une erreur est survenue");
  }
};

const handleDeletePlat = async (plat: Plat) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${plat.nom}" ?`)) {
    return;
  }

  const result = await deletePlat(plat.id);

  if (result.success) {
    const index = plats.value.findIndex((p) => p.id === plat.id);
    if (index !== -1) {
      plats.value.splice(index, 1);
    }

    toast.success("Plat supprimé avec succès");
  } else {
    toast.error(result.error || "Une erreur est survenue");
  }
};

watch(restaurants, (newRestaurants) => {
  if (newRestaurants.length > 0 && !selectedRestaurant.value) {
    const firstRestaurant = newRestaurants[0];
    if (firstRestaurant) {
      selectedRestaurant.value = firstRestaurant;
    }
  }
});

onMounted(() => {
  fetchMyRestaurants();
  fetchPlats();
});
</script>

<style scoped>
.tab-button:active {
  transform: skewX(-6deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
