<template>
  <div class="relative z-10 mb-8">
    <div class="relative left-15 flex items-center gap-2 text-base italic">
      <NuxtLink
        to="/restaurants"
        class="text-primary hover:text-secondary font-bold duration-300 hover:underline"
      >
        Nos restaurants
      </NuxtLink>
      <span class="text-gray-400">></span>

      <NuxtLink
        v-if="platName && restaurantSlug"
        :to="`/restaurants/${restaurantSlug}/plats`"
        class="text-primary hover:text-secondary font-bold duration-300 hover:underline"
      >
        {{ restaurantName || "Chargement..." }}
      </NuxtLink>
      <span v-else class="font-bold text-[#df650f]">
        {{ restaurantName || "Chargement..." }}
      </span>

      <template v-if="platName">
        <span class="text-gray-400">></span>
        <span class="font-bold text-[#df650f]">{{ platName }}</span>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurantName: {
    type: String,
    default: null,
  },
  restaurantSlug: {
    type: String,
    default: null,
  },
  platName: {
    type: String,
    default: null,
  },
});
</script>
