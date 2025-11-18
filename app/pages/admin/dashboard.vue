<template>
  <div class="p-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex gap-6">
        <AdminSidebar />

        <div class="flex-1">
          <AdminUsersTableSkeleton v-if="pendingUsers" />

          <LazyAdminUsersTable
            v-else
            :users="restaurantOwners"
            :loading="pendingUsers"
            :error="errorUsers"
            :get-role-label="getRoleLabel"
            @add="openAddModal"
            @edit="openEditModal"
            @delete="handleDeleteUser"
            @retry="refresh"
          />
        </div>
      </div>
    </div>

    <AdminRestaurateurModal
      v-model="showModal"
      :user="selectedUser"
      :restaurants="restaurants"
      @submit="handleSubmitUser"
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/auth";
import { useAdminUsers } from "~/composables/admin/useAdminUsers";
import { useAdminRestaurants } from "~/composables/admin/useAdminRestaurants";
import { useToast } from "~/composables/useToast";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const {
  users,
  restaurantOwners,
  pending: pendingUsers,
  error: errorUsers,
  getRoleLabel,
  fetchUsers,
  refresh,
  createUser,
  updateUser,
  deleteUser,
} = useAdminUsers();

const {
  restaurants,
  fetchRestaurants,
  assignRestaurant,
} = useAdminRestaurants();

const toast = useToast();
const showModal = ref(false);
const selectedUser = ref<User | null>(null);

const openAddModal = () => {
  selectedUser.value = null;
  showModal.value = true;
};

const openEditModal = (user: User) => {
  selectedUser.value = user;
  showModal.value = true;
};

const handleSubmitUser = async (userData: any) => {
  let result;
  const isEdit = !!userData.id;

  if (isEdit) {
    result = await updateUser(userData.id, userData);
  } else {
    result = await createUser(userData);
  }

  if (result.success) {
    const userId = userData.id || result.data?.id;
    const currentRestaurantIds = restaurants.value
      .filter((r) => r.owner_id === userId)
      .map((r) => r.id);

    const toAssign = userData.restaurantIds.filter(
      (id: number) => !currentRestaurantIds.includes(id)
    );
    const toUnassign = currentRestaurantIds.filter(
      (id: number) => !userData.restaurantIds.includes(id)
    );

    // Mise à jour des restaurants
    for (const restaurantId of toUnassign) {
      const assignResult = await assignRestaurant(restaurantId, null);
      if (assignResult.success && assignResult.data) {
        const idx = restaurants.value.findIndex((r) => r.id === restaurantId);
        if (idx !== -1) {
          restaurants.value[idx] = assignResult.data;
        }
      }
    }

    for (const restaurantId of toAssign) {
      const assignResult = await assignRestaurant(restaurantId, userId);
      if (assignResult.success && assignResult.data) {
        const idx = restaurants.value.findIndex((r) => r.id === restaurantId);
        if (idx !== -1) {
          restaurants.value[idx] = assignResult.data;
        }
      }
    }

    // Mise à jour locale de la liste des utilisateurs sans recharger
    if (isEdit && result.data) {
      const userIndex = users.value.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users.value[userIndex] = result.data;
      }
    } else if (!isEdit && result.data) {
      users.value.push(result.data);
    }

    showModal.value = false;
    toast.success(
      isEdit
        ? "Restaurateur modifié avec succès"
        : "Restaurateur créé avec succès"
    );
  } else {
    toast.error(result.error || "Une erreur est survenue");
  }
};

const handleDeleteUser = async (user: User) => {
  const confirmed = confirm(
    `Êtes-vous sûr de vouloir supprimer le restaurateur "${user.name}" ?\n\nCette action est irréversible.`
  );

  if (!confirmed) return;

  const result = await deleteUser(user.id);

  if (result.success) {
    toast.success(`Restaurateur "${user.name}" supprimé avec succès`);
  } else {
    toast.error(result.error || "Erreur lors de la suppression");
  }
};

onMounted(() => {
  fetchUsers();
  fetchRestaurants();
});
</script>
