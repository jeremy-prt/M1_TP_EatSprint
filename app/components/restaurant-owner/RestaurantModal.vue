<template>
  <AdminModal v-model="isOpen" title="Éditer mon restaurant">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UiInput
        v-model="formData.nom"
        label="Nom du restaurant"
        type="text"
        placeholder="Le Gourmet Parisien"
        required
      />

      <UiInput
        v-model="formData.adresse"
        label="Adresse"
        type="text"
        placeholder="123 rue de la Paix"
        required
      />

      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="formData.ville"
          label="Ville"
          type="text"
          placeholder="Paris"
          required
        />

        <UiInput
          v-model="formData.categorie"
          label="Catégorie"
          type="text"
          placeholder="Gastronomique"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="formData.cuisine"
          label="Type de cuisine"
          type="text"
          placeholder="Française"
          required
        />

        <div>
          <label class="mb-2 block font-semibold text-gray-700">
            <span class="inline-flex items-center gap-2">
              Gamme de prix
              <div class="tooltip-container relative">
                <Icon
                  name="mdi:help-circle-outline"
                  size="18"
                  class="relative top-1 cursor-help text-gray-400 hover:text-gray-600"
                />
                <div class="tooltip">
                  <div class="space-y-1 text-xs">
                    <div>
                      <span class="font-semibold text-green-600">€</span> = Bon
                      marché
                    </div>
                    <div>
                      <span class="font-semibold text-blue-600">€€</span> =
                      Modéré
                    </div>
                    <div>
                      <span class="font-semibold text-orange-600">€€€</span> =
                      Cher
                    </div>
                    <div>
                      <span class="font-semibold text-red-600">€€€€</span> =
                      Très cher
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </label>
          <input
            v-model="formData.gamme_prix"
            type="text"
            placeholder="€€"
            required
            class="focus:border-primary w-full border-2 border-gray-300 px-4 py-3 duration-300 focus:outline-none"
          />
        </div>
      </div>

      <UiInput
        v-model.number="formData.temps_livraison_min"
        label="Temps de livraison (min)"
        type="number"
        placeholder="30"
        required
      />

      <UiInput
        v-model="formData.image"
        label="Image (URL)"
        type="text"
        placeholder="https://..."
        required
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          @click="close"
          type="button"
          class="button-cta inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none bg-gray-500 px-6 py-2 font-bold text-white no-underline shadow-[4px_4px_0_black] transition-all duration-150 focus:outline-none"
        >
          <span class="skew-x-6 italic"> Annuler </span>
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="button-cta bg-primary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-6 py-2 font-bold text-white no-underline shadow-[4px_4px_0_black] transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span class="skew-x-6 italic">
            {{ loading ? "Enregistrement..." : "Modifier" }}
          </span>
        </button>
      </div>
    </template>
  </AdminModal>
</template>

<script setup lang="ts">
import type { Restaurant } from "~/types/restaurant";

interface Props {
  modelValue: boolean;
  restaurant: Restaurant | null;
}

interface FormData {
  nom: string;
  adresse: string;
  ville: string;
  categorie: string;
  image: string;
  cuisine: string;
  gamme_prix: string;
  temps_livraison_min: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  restaurant: null,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [data: FormData];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = ref(false);

const formData = ref<FormData>({
  nom: "",
  adresse: "",
  ville: "",
  categorie: "",
  image: "",
  cuisine: "",
  gamme_prix: "",
  temps_livraison_min: 0,
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.restaurant) {
      formData.value = {
        nom: props.restaurant.nom,
        adresse: props.restaurant.adresse,
        ville: props.restaurant.ville,
        categorie: props.restaurant.categorie,
        image: props.restaurant.image,
        cuisine: props.restaurant.cuisine,
        gamme_prix: props.restaurant.gamme_prix,
        temps_livraison_min: props.restaurant.temps_livraison_min,
      };
    }
  },
);

const handleSubmit = async () => {
  loading.value = true;
  await emit("submit", formData.value);
  loading.value = false;
};

const close = () => {
  isOpen.value = false;
};
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}

.button-cta:disabled:active {
  transform: skewX(-6deg);
  box-shadow: 4px 4px 0 black;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: white;
  border: 2px solid black;
  box-shadow: 4px 4px 0 black;
  padding: 0.75rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  z-index: 50;
  min-width: 160px;
}

.tooltip-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
