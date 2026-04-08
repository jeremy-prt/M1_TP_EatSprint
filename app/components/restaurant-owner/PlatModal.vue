<template>
  <AdminModal
    v-model="isOpen"
    :title="editMode ? 'Éditer un plat' : 'Ajouter un plat'"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="formData.name"
          label="Nom du plat"
          type="text"
          placeholder="Buddha Bowl Végétarien"
          required
        />

        <UiInput
          v-model.number="formData.price"
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
          v-model="formData.category"
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
          v-model.number="formData.preparationTime"
          label="Temps de préparation (min)"
          type="number"
          placeholder="20"
          required
        />
      </div>

      <UiInput
        v-model="formData.allergens"
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
          v-model="formData.isAvailable"
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
          <UiCheckbox v-model="formData.isVegetarian" label="Végétarien" />
          <UiCheckbox v-model="formData.isVegan" label="Vegan" />
          <UiCheckbox v-model="formData.isSpicy" label="Épicé" />
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
  name: string
  price: number
  description: string
  category: string
  calories: number
  preparationTime: number
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
  allergens: string | undefined
  isAvailable: boolean
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
  name: '',
  price: 0,
  description: '',
  category: '',
  calories: 0,
  preparationTime: 0,
  isVegetarian: false,
  isVegan: false,
  isSpicy: false,
  allergens: undefined,
  isAvailable: true,
  image: ''
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.plat) {
        formData.value = {
          name: props.plat.name,
          price: props.plat.price,
          description: props.plat.description,
          category: props.plat.category,
          calories: props.plat.calories,
          preparationTime: props.plat.preparationTime,
          isVegetarian: props.plat.isVegetarian,
          isVegan: props.plat.isVegan,
          isSpicy: props.plat.isSpicy,
          allergens: props.plat.allergens ?? undefined,
          isAvailable: props.plat.isAvailable,
          image: props.plat.image
        }
      } else {
        formData.value = {
          name: '',
          price: 0,
          description: '',
          category: '',
          calories: 0,
          preparationTime: 0,
          isVegetarian: false,
          isVegan: false,
          isSpicy: false,
          allergens: undefined,
          isAvailable: true,
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
