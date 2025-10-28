<template>
  <div
    class="bg-secondary/10 -skew-x-3 border-4 border-black p-8 shadow-[8px_8px_0_black]"
  >
    <div class="skew-x-3 space-y-6">
      <div
        class="flex items-center justify-between border-b-2 border-black pb-4"
      >
        <span class="text-2xl font-bold text-gray-800">Total</span>
        <span class="text-4xl font-extrabold text-gray-800">
          {{ totalPrice.toFixed(2) }}€
        </span>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row">
        <button
          @click="handleClear"
          class="button-vider flex flex-1 -skew-x-6 cursor-pointer items-center justify-center gap-2 border-none bg-gray-500 px-6 py-3 text-xl font-bold text-white shadow-[4px_4px_0_black] transition-all duration-150"
        >
          <Icon name="mdi:delete-sweep" size="24" class="skew-x-6" />
          <span class="skew-x-6">Vider le panier</span>
        </button>

        <button
          @click="handleOrder"
          :disabled="isOrdering"
          class="bg-secondary button-vider flex flex-1 -skew-x-6 cursor-pointer items-center justify-center gap-2 border-none px-6 py-3 text-xl font-bold text-white shadow-[4px_4px_0_black] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon
            v-if="!isOrdering"
            name="mdi:credit-card"
            size="24"
            class="skew-x-6"
          />
          <Icon v-else name="mdi:loading" size="24" class="animate-spin" />
          <span class="skew-x-6">{{
            isOrdering ? "Commande en cours..." : "Commander"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalPrice: number;
  isOrdering: boolean;
}>();

const emit = defineEmits<{
  clear: [];
  order: [];
}>();

const handleClear = () => {
  emit("clear");
};

const handleOrder = () => {
  emit("order");
};
</script>

<style scoped>
.button-vider:active {
  transform: skewX(-15deg) translate(2px, 2px);
  box-shadow: 2px 2px 0 black;
}
</style>
