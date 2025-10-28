<template>
  <div class="container mx-auto px-4 py-12">
    <div
      class="-skew-x-3 overflow-hidden border-4 border-black bg-white/70 p-8 shadow-[6px_6px_0_black] backdrop-blur-xs transition-all"
    >
      <div class="mb-6 border-b border-gray-200 pb-6">
        <h2 class="mb-4 text-2xl font-bold">Mes informations</h2>
        <div class="space-y-2">
          <p>
            <span class="font-semibold">Nom :</span> {{ authStore.user?.name }}
          </p>
          <p>
            <span class="font-semibold">Email :</span>
            {{ authStore.user?.email }}
          </p>
          <p>
            <span class="font-semibold">Rôle :</span>
            <span
              class="ml-2 inline-block rounded px-2 py-1 text-sm font-semibold"
              :class="{
                'bg-blue-100 text-blue-800': authStore.isCustomer,
                'bg-red-100 text-red-800': authStore.isAdmin,
                'bg-green-100 text-green-800': authStore.isRestaurantOwner,
              }"
            >
              {{ roleLabel }}
            </span>
          </p>
          <p v-if="authStore.user?.adresse">
            <span class="font-semibold">Adresse :</span>
            {{ authStore.user.adresse }}
          </p>
          <p v-if="authStore.user?.ville">
            <span class="font-semibold">Ville :</span>
            {{ authStore.user.ville }} {{ authStore.user.code_postal }}
          </p>
        </div>
      </div>

      <!-- Accès rapides -->
      <div class="mb-6">
        <h2 class="mb-4 text-2xl font-bold">Accès rapides</h2>
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            v-if="authStore.isAdmin"
            to="/admin/dashboard"
            class="button-cta bg-primary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
          >
            <span class="skew-x-6 italic"> Administration </span>
          </NuxtLink>

          <NuxtLink
            v-if="authStore.isRestaurantOwner"
            to="/restaurant-owner/dashboard"
            class="button-cta bg-primary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
          >
            <span class="skew-x-6 italic"> Mes restaurants </span>
          </NuxtLink>

          <NuxtLink
            to="/mes-commandes"
            class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
          >
            <span class="skew-x-6 italic"> Mes commandes </span>
          </NuxtLink>
        </div>

        <div class="mt-8">
          <button
            @click="handleLogout"
            class="button-cta bg-accent inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-xl font-bold text-white shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
          >
            <span class="skew-x-6 italic"> Se déconnecter </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

definePageMeta({
  middleware: "auth",
});

const roleLabel = computed(() => {
  switch (authStore.user?.role) {
    case "admin":
      return "Administrateur";
    case "restaurant_owner":
      return "Restaurateur";
    case "customer":
      return "Client";
    default:
      return "Inconnu";
  }
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    navigateTo("/restaurants");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 black;
}
</style>
