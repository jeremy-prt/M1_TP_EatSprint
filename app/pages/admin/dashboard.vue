<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-4xl font-bold uppercase text-primary">
      Administration
    </h1>

    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Section Users -->
      <div class="bg-white p-6 shadow-[8px_8px_0_#f97316]">
        <h2 class="mb-4 text-2xl font-bold">Utilisateurs</h2>

        <div v-if="loadingUsers" class="text-gray-600">
          Chargement...
        </div>

        <div v-else-if="errorUsers" class="bg-red-50 p-3 text-red-600">
          {{ errorUsers }}
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between border-b border-gray-200 py-2"
          >
            <div>
              <p class="font-semibold">{{ user.name }}</p>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
              <span
                class="inline-block rounded px-2 py-1 text-xs font-semibold"
                :class="{
                  'bg-blue-100 text-blue-800': user.role === 'customer',
                  'bg-red-100 text-red-800': user.role === 'admin',
                  'bg-green-100 text-green-800': user.role === 'restaurant_owner'
                }"
              >
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="showCreateUserForm = !showCreateUserForm"
          class="button-cta bg-secondary mt-4 inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-6 py-2 text-lg font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
        >
          <span class="skew-x-6 italic">
            {{ showCreateUserForm ? 'Annuler' : 'Créer un restaurateur' }}
          </span>
        </button>

        <div v-if="showCreateUserForm" class="mt-4 space-y-3 border-t pt-4">
          <UiInput
            v-model="newUser.name"
            label="Nom"
            type="text"
            placeholder="Nom du restaurateur"
            required
          />
          <UiInput
            v-model="newUser.email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            required
          />
          <UiInput
            v-model="newUser.password"
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            required
          />

          <button
            @click="createUser"
            :disabled="creatingUser"
            class="button-cta bg-primary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-6 py-2 text-lg font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none disabled:opacity-50"
          >
            <span class="skew-x-6 italic">
              {{ creatingUser ? 'Création...' : 'Créer' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Section Restaurants -->
      <div class="bg-white p-6 shadow-[8px_8px_0_#f97316]">
        <h2 class="mb-4 text-2xl font-bold">Restaurants</h2>

        <div v-if="loadingRestaurants" class="text-gray-600">
          Chargement...
        </div>

        <div v-else-if="errorRestaurants" class="bg-red-50 p-3 text-red-600">
          {{ errorRestaurants }}
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            class="border-b border-gray-200 py-2"
          >
            <p class="font-semibold">{{ restaurant.nom }}</p>
            <p class="text-sm text-gray-600">{{ restaurant.ville }}</p>
            <div class="mt-2 flex items-center gap-2">
              <select
                v-model="restaurant.owner_id"
                @change="assignRestaurant(restaurant)"
                class="rounded border-2 border-gray-300 px-2 py-1 text-sm"
              >
                <option :value="null">Non assigné</option>
                <option
                  v-for="owner in restaurantOwners"
                  :key="owner.id"
                  :value="owner.id"
                >
                  {{ owner.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'
import type { Restaurant } from '~/types/restaurant'

definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

const users = ref<User[]>([])
const restaurants = ref<Restaurant[]>([])
const loadingUsers = ref(true)
const loadingRestaurants = ref(true)
const errorUsers = ref('')
const errorRestaurants = ref('')
const showCreateUserForm = ref(false)
const creatingUser = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: ''
})

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrateur'
    case 'restaurant_owner':
      return 'Restaurateur'
    case 'customer':
      return 'Client'
    default:
      return role
  }
}

const restaurantOwners = computed(() => {
  return users.value.filter(u => u.role === 'restaurant_owner')
})

const fetchUsers = async () => {
  loadingUsers.value = true
  errorUsers.value = ''

  try {
    users.value = await $fetch('/api/admin/users')
  } catch (err: any) {
    errorUsers.value = err.data?.statusMessage || 'Erreur lors du chargement des utilisateurs'
  } finally {
    loadingUsers.value = false
  }
}

const fetchRestaurants = async () => {
  loadingRestaurants.value = true
  errorRestaurants.value = ''

  try {
    restaurants.value = await $fetch('/api/admin/restaurants')
  } catch (err: any) {
    errorRestaurants.value = err.data?.statusMessage || 'Erreur lors du chargement des restaurants'
  } finally {
    loadingRestaurants.value = false
  }
}

const createUser = async () => {
  creatingUser.value = true

  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: {
        ...newUser.value,
        role: 'restaurant_owner'
      }
    })

    newUser.value = { name: '', email: '', password: '' }
    showCreateUserForm.value = false
    await fetchUsers()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erreur lors de la création')
  } finally {
    creatingUser.value = false
  }
}

const assignRestaurant = async (restaurant: Restaurant) => {
  try {
    await $fetch(`/api/admin/restaurants/${restaurant.id}`, {
      method: 'PUT',
      body: {
        owner_id: restaurant.owner_id
      }
    })
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erreur lors de l\'assignation')
    await fetchRestaurants()
  }
}

onMounted(() => {
  fetchUsers()
  fetchRestaurants()
})
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 black;
}
</style>
