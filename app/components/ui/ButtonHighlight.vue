<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-2xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
  >
    <span class="skew-x-6 italic">
      <slot>{{ $t('ui.button.default') }}</slot>
    </span>
  </NuxtLink>
  <button
    v-else
    class="button-cta bg-secondary inline-flex -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-2xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none"
  >
    <span class="skew-x-6 italic">
      <slot>{{ $t('ui.button.default') }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  to?: string;
}>();
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 black;
}
</style>
