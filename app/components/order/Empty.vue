<template>
  <div
    class="bg-secondary/10 -skew-x-3 border-4 border-black p-12 text-center shadow-[8px_8px_0_black]"
  >
    <div class="skew-x-3">
      <Icon
        name="mdi:receipt-text-off"
        size="64"
        class="mx-auto mb-4 text-gray-400"
      />
      <h2 class="mb-4 text-2xl font-bold text-gray-700">
        {{ $t('orders.empty.title') }}
      </h2>
      <p class="mb-6 text-gray-600">
        {{ $t('orders.empty.description') }}
      </p>
      <UiButtonHighlight to="/restaurants">
        {{ $t('orders.empty.cta') }}
      </UiButtonHighlight>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
