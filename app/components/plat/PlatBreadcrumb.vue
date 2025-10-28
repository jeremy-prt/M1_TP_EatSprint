<template>
  <div class="relative z-10 mb-8">
    <div class="relative left-15 flex items-center gap-2 text-base italic">
      <NuxtLink
        to="/restaurants"
        class="text-primary hover:text-secondary font-bold duration-300 hover:underline"
      >
        {{ $t('nav.restaurants') }}
      </NuxtLink>
      <span class="text-gray-400">{{ $t('plats.breadcrumb.separator') }}</span>

      <NuxtLink
        v-if="platName && restaurantSlug"
        :to="`/restaurants/${restaurantSlug}/plats`"
        class="text-primary hover:text-secondary font-bold duration-300 hover:underline"
      >
        {{ restaurantName || $t('plats.breadcrumb.loading') }}
      </NuxtLink>
      <span v-else class="font-bold text-[#df650f]">
        {{ restaurantName || $t('plats.breadcrumb.loading') }}
      </span>

      <template v-if="platName">
        <span class="text-gray-400">{{ $t('plats.breadcrumb.separator') }}</span>
        <span class="font-bold text-[#df650f]">{{ platName }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  restaurantName?: string | null
  restaurantSlug?: string | null
  platName?: string | null
}

withDefaults(defineProps<Props>(), {
  restaurantName: null,
  restaurantSlug: null,
  platName: null
})
</script>
