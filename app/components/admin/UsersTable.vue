<template>
  <div
    class="flex h-[calc(100vh-var(--spacing-header)-4rem)] flex-col overflow-hidden bg-white shadow-[8px_8px_0_#fb923c]"
  >
    <div class="border-b-2 border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h2 class="text-secondary text-2xl font-bold">Restaurateurs</h2>
        <button
          @click="$emit('add')"
          class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center gap-2 border-none px-4 py-2 text-base font-bold text-white no-underline shadow-[4px_4px_0_black] transition-all duration-150 focus:outline-none"
        >
          <span class="flex skew-x-6 items-center gap-2 italic">
            <Icon name="mdi:plus" size="20" />
            Ajouter
          </span>
        </button>
      </div>
    </div>

    <div v-if="error" class="flex-1 overflow-y-auto p-6">
      <AdminError
        :message="error"
        title="Erreur de chargement"
        @retry="$emit('retry')"
      />
    </div>

    <div v-else-if="!loading" class="flex-1 overflow-y-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase"
            >
              Nom
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase"
            >
              Rôle
            </th>
            <th
              class="px-6 py-3 text-right text-sm font-bold text-gray-700 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="user in users"
            :key="user.id"
            class="transition-colors hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <p class="font-semibold text-gray-900">{{ user.name }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="text-gray-600">{{ user.email }}</p>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-block rounded px-3 py-1 text-xs font-semibold"
                :class="{
                  'bg-blue-100 text-blue-800': user.role === 'customer',
                  'bg-red-100 text-red-800': user.role === 'admin',
                  'bg-green-100 text-green-800':
                    user.role === 'restaurant_owner',
                }"
              >
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                @click="$emit('edit', user)"
                class="bg-secondary inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-white shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
              >
                <Icon name="mdi:pencil" size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="users.length === 0"
        class="px-6 py-12 text-center text-gray-500"
      >
        Aucun restaurateur
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserRole } from '~/types/auth'

interface Props {
  users: User[]
  loading: boolean
  error: string
  getRoleLabel: (role: UserRole) => string
}

withDefaults(defineProps<Props>(), {
  users: () => [],
  loading: false,
  error: ''
})

defineEmits<{
  'add': []
  'edit': [user: User]
  'retry': []
}>()
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
