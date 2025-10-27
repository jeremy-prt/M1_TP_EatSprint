<template>
  <AdminModal
    v-model="isOpen"
    :title="editMode ? 'Éditer un restaurateur' : 'Ajouter un restaurateur'"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="formData.name"
          label="Nom"
          type="text"
          placeholder="Nom du restaurateur"
          required
        />

        <UiInput
          v-model="formData.email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          required
        />
      </div>

      <UiInput
        v-if="!editMode"
        v-model="formData.password"
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        required
      />

      <div class="space-y-4">
        <UiInput
          v-model="formData.adresse"
          label="Adresse"
          type="text"
          placeholder="123 rue de la Paix"
          optional
        />

        <div class="grid gap-4 md:grid-cols-2">
          <UiInput
            v-model="formData.ville"
            label="Ville"
            type="text"
            placeholder="Paris"
            optional
          />

          <UiInput
            v-model="formData.code_postal"
            label="Code postal"
            type="text"
            placeholder="75000"
            optional
          />
        </div>
      </div>

      <AdminAutocomplete
        v-model="selectedRestaurants"
        :items="availableRestaurants"
        item-label="nom"
        item-sub-label="ville"
        item-value="id"
        label="Restaurants assignés"
        placeholder="Rechercher et ajouter un restaurant..."
        multiple
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
            {{
              loading ? "Enregistrement..." : editMode ? "Modifier" : "Créer"
            }}
          </span>
        </button>
      </div>
    </template>
  </AdminModal>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'
import type { Restaurant } from '~/types/restaurant'

interface Props {
  modelValue: boolean
  user: User | null
  restaurants: Restaurant[]
}

interface FormData {
  name: string
  email: string
  password: string
  adresse: string
  ville: string
  code_postal: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  user: null,
  restaurants: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const editMode = computed(() => !!props.user)
const loading = ref(false)
const selectedRestaurants = ref<Restaurant[]>([])

const formData = ref<FormData>({
  name: '',
  email: '',
  password: '',
  adresse: '',
  ville: '',
  code_postal: ''
})

const availableRestaurants = computed(() => {
  return props.restaurants.filter(
    (r) => !r.owner_id || r.owner_id === props.user?.id
  )
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.user) {
        formData.value = {
          name: props.user.name,
          email: props.user.email,
          password: '',
          adresse: props.user.adresse || '',
          ville: props.user.ville || '',
          code_postal: props.user.code_postal || ''
        }

        selectedRestaurants.value = props.restaurants.filter(
          (r) => r.owner_id === props.user?.id
        )
      } else {
        formData.value = {
          name: '',
          email: '',
          password: '',
          adresse: '',
          ville: '',
          code_postal: ''
        }
        selectedRestaurants.value = []
      }
    }
  }
)

const handleSubmit = async () => {
  loading.value = true
  await emit('submit', {
    ...formData.value,
    id: props.user?.id,
    restaurantIds: selectedRestaurants.value.map((r) => r.id)
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
