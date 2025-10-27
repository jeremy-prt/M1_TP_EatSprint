<template>
  <AdminModal
    v-model="isOpen"
    :title="editMode ? 'Éditer un plat' : 'Ajouter un plat'"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="formData.nom"
          label="Nom du plat"
          type="text"
          placeholder="Buddha Bowl Végétarien"
          required
        />

        <UiInput
          v-model.number="formData.prix"
          label="Prix (€)"
          type="number"
          step="0.01"
          placeholder="12.50"
          required
        />
      </div>

      <UiInput
        v-model="formData.description"
        label="Description"
        type="text"
        placeholder="Un bol complet et équilibré..."
        required
      />

      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="formData.categorie"
          label="Catégorie"
          type="text"
          placeholder="Plat principal"
          required
        />

        <UiInput
          v-model="formData.image"
          label="Image (URL)"
          type="text"
          placeholder="https://..."
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model.number="formData.calories"
          label="Calories"
          type="number"
          placeholder="450"
          required
        />

        <UiInput
          v-model.number="formData.temps_preparation_min"
          label="Temps de préparation (min)"
          type="number"
          placeholder="20"
          required
        />
      </div>

      <UiInput
        v-model="formData.allergenes"
        label="Allergènes"
        type="text"
        placeholder="Gluten;Lactose;Fruits à coque"
        optional
        optional-text="optionnel - séparé par ;"
      />

      <div class="border-t-2 border-gray-200 pt-4">
        <h3 class="mb-3 text-sm font-bold uppercase text-gray-600">
          Disponibilité
        </h3>
        <UiToggle
          v-model="formData.disponible"
          label="Disponible à la vente"
          active-text="Le plat est disponible"
          inactive-text="Le plat est indisponible"
        />
      </div>

      <div class="border-t-2 border-gray-200 pt-4">
        <h3 class="mb-3 text-sm font-bold uppercase text-gray-600">
          Caractéristiques alimentaires
        </h3>
        <div class="grid gap-3 md:grid-cols-2">
          <UiCheckbox v-model="formData.vegetarien" label="Végétarien" />
          <UiCheckbox v-model="formData.vegan" label="Vegan" />
          <UiCheckbox v-model="formData.epice" label="Épicé" />
        </div>
      </div>
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
            {{
              loading ? 'Enregistrement...' : editMode ? 'Modifier' : 'Créer'
            }}
          </span>
        </button>
      </div>
    </template>
  </AdminModal>
</template>

<script setup lang="ts">
import type { Plat } from '~/types/plat'

interface Props {
  modelValue: boolean
  plat: Plat | null
}

interface FormData {
  nom: string
  prix: number
  description: string
  categorie: string
  calories: number
  temps_preparation_min: number
  vegetarien: boolean
  vegan: boolean
  epice: boolean
  allergenes: string | null
  disponible: boolean
  image: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  plat: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: FormData & { id?: number }]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const editMode = computed(() => !!props.plat)
const loading = ref(false)

const formData = ref<FormData>({
  nom: '',
  prix: 0,
  description: '',
  categorie: '',
  calories: 0,
  temps_preparation_min: 0,
  vegetarien: false,
  vegan: false,
  epice: false,
  allergenes: null,
  disponible: true,
  image: ''
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.plat) {
        formData.value = {
          nom: props.plat.nom,
          prix: props.plat.prix,
          description: props.plat.description,
          categorie: props.plat.categorie,
          calories: props.plat.calories,
          temps_preparation_min: props.plat.temps_preparation_min,
          vegetarien: props.plat.vegetarien,
          vegan: props.plat.vegan,
          epice: props.plat.epice,
          allergenes: props.plat.allergenes,
          disponible: props.plat.disponible,
          image: props.plat.image
        }
      } else {
        formData.value = {
          nom: '',
          prix: 0,
          description: '',
          categorie: '',
          calories: 0,
          temps_preparation_min: 0,
          vegetarien: false,
          vegan: false,
          epice: false,
          allergenes: null,
          disponible: true,
          image: ''
        }
      }
    }
  }
)

const handleSubmit = async () => {
  loading.value = true
  await emit('submit', {
    ...formData.value,
    id: props.plat?.id
  })
  loading.value = false
}

const close = () => {
  isOpen.value = false
}
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
</style>
