<template>
  <!-- Affichage du skeleton pendant le chargement -->
  <RestaurantCategorySkeleton v-if="pending" />

  <!-- Affichage de l'erreur avec bouton retry -->
  <RestaurantCategoryError
    v-else-if="error"
    :categorie="categorie"
    @retry="refresh"
  />

  <!-- Affichage normal des restaurants -->
  <div v-else>
    <div class="mb-4 flex items-center justify-between pr-6">
      <h2 class="text-accent relative left-12 text-2xl font-bold italic">
        {{ categorie }}
      </h2>
      <div class="flex gap-2">
        <button
          @click="scrollPrev"
          class="bg-secondary hover:bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none shadow-[3px_3px_0_black] transition-all hover:scale-110 active:scale-95"
          aria-label="Précédent"
        >
          <Icon name="mdi:chevron-left" size="24" class="text-white" />
        </button>
        <button
          @click="scrollNext"
          class="bg-secondary hover:bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none shadow-[3px_3px_0_black] transition-all hover:scale-110 active:scale-95"
          aria-label="Suivant"
        >
          <Icon name="mdi:chevron-right" size="24" class="text-white" />
        </button>
      </div>
    </div>

    <div class="overflow-hidden pr-6">
      <div ref="scrollContainer" class="carousel-container pb-2 pl-5">
        <!-- Message si aucun restaurant dans cette catégorie -->
        <div
          v-if="restaurantsFiltered.length === 0"
          class="flex w-full items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 p-8"
        >
          <p class="text-gray-500">Aucun restaurant dans cette catégorie</p>
        </div>

        <!-- Liste des restaurants -->
        <NuxtLink
          v-for="restaurant in restaurantsFiltered"
          :key="restaurant.id"
          :to="`/restaurants/${restaurant.slug}/plats`"
          class="carousel-item restaurant-card group relative -skew-x-12 cursor-pointer overflow-hidden shadow-[6px_6px_0_#fb923c] transition-all duration-150"
        >
          <div class="absolute inset-0 bg-gray-400"></div>

          <NuxtImg
            :src="restaurant.image"
            :alt="restaurant.nom"
            width="300"
            height="200"
            class="restaurant-image absolute inset-0 h-full w-full object-cover transition-transform duration-300"
            loading="lazy"
          />

          <div class="absolute inset-0 bg-black/20"></div>
          <div
            class="absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t from-black/70 via-black/70 to-transparent pt-20"
          >
            <div class="absolute bottom-9 left-4">
              <h3 class="text-text text-lg font-bold">
                {{ restaurant.nom }}
              </h3>
            </div>
            <div class="restaurant-ville absolute left-4 bottom-4 flex items-center gap-1">
              <Icon name="mdi:map-marker" size="16" class="text-red-400" />
              <span class="text-sm font-semibold text-white">
                {{ restaurant.ville }}
              </span>
            </div>
            <div class="restaurant-note absolute bottom-4 right-4 flex items-center gap-1">
              <Icon name="mdi:star" size="16" class="text-yellow-400" />
              <span class="text-sm font-semibold text-white">
                {{ restaurant.note }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  categorie: {
    type: String,
    required: true,
  },
});

// POUR TESTER LES ERREURS : Faut passer true dans useRestaurants, ça permet de test l'affichage d'erreur
const { getRestaurantsByCategorie, pending, error, refresh } = useRestaurants();
const scrollContainer = ref(null);

const restaurantsFiltered = computed(() =>
  getRestaurantsByCategorie(props.categorie),
);

const scrollPrev = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value;
    const containerWidth = container.offsetWidth;
    const currentScroll = container.scrollLeft;

    if (currentScroll <= 0) {
      container.scrollTo({
        left: container.scrollWidth - containerWidth,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({
        left: -containerWidth,
        behavior: "smooth",
      });
    }
  }
};

const scrollNext = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value;
    const containerWidth = container.offsetWidth;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - containerWidth;

    if (currentScroll >= maxScroll - 10) {
      container.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({
        left: containerWidth,
        behavior: "smooth",
      });
    }
  }
};
</script>

<style scoped>
.carousel-container {
  display: flex;
  gap: 1rem;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 calc((100% - 1rem) / 2);
  height: 200px;
  background-color: white;
  scroll-snap-align: start;
}

.restaurant-ville {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.restaurant-note {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.restaurant-card:hover .restaurant-ville {
  opacity: 1;
  transform: translateY(0);
}

.restaurant-card:hover .restaurant-note {
  opacity: 1;
  transform: translateY(0);
}

.restaurant-card:hover .restaurant-image {
  transform: scale(1.1);
}

.restaurant-card:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 #fb923c;
}

@media (min-width: 768px) {
  .carousel-item {
    flex: 0 0 calc((100% - 2rem) / 3);
  }
}

@media (min-width: 1024px) {
  .carousel-item {
    flex: 0 0 calc((100% - 3rem) / 4);
  }
}
</style>
