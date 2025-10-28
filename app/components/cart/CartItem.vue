<template>
  <div
    class="-skew-x-3 overflow-hidden border-4 border-black bg-white/70 shadow-[6px_6px_0_black] backdrop-blur-xs transition-all"
  >
    <div
      class="grid skew-x-3 grid-cols-1 gap-4 p-4 md:grid-cols-12 md:items-center"
    >
      <div class="md:col-span-2">
        <div class="relative -skew-x-6 overflow-hidden">
          <NuxtImg
            :src="item.plat.image"
            :alt="item.plat.nom"
            width="150"
            height="100"
            class="h-24 w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div class="md:col-span-4">
        <h3 class="mb-1 text-xl font-bold text-gray-800">
          {{ item.plat.nom }}
        </h3>
        <p class="text-accent text-lg font-bold">
          {{ item.plat.prix.toFixed(2) }}{{ $t('cart.item.perUnit') }}
        </p>
      </div>

      <div class="flex items-center gap-2 md:col-span-3">
        <button
          @click="handleDecrement"
          class="bg-secondary hover:bg-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
          :aria-label="$t('cart.item.decreaseQty')"
        >
          <Icon name="mdi:minus" size="20" class="text-white" />
        </button>
        <span class="w-12 text-center text-xl font-bold">{{
          item.quantity
        }}</span>
        <button
          @click="handleIncrement"
          class="bg-secondary hover:bg-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
          :aria-label="$t('cart.item.increaseQty')"
        >
          <Icon name="mdi:plus" size="20" class="text-white" />
        </button>
      </div>

      <div class="flex items-center justify-between md:col-span-3">
        <span class="text-accent text-2xl font-extrabold">
          {{ (item.plat.prix * item.quantity).toFixed(2) }}€
        </span>
        <button
          @click="handleRemove"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-red-500 shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
          :aria-label="$t('cart.item.remove')"
        >
          <Icon name="mdi:delete" size="24" class="text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from "~/types/cart";

const props = defineProps<{
  item: CartItem;
}>();

const emit = defineEmits<{
  decrement: [platId: number];
  increment: [platId: number];
  remove: [platId: number];
}>();

const handleDecrement = () => {
  emit("decrement", props.item.plat.id);
};

const handleIncrement = () => {
  emit("increment", props.item.plat.id);
};

const handleRemove = () => {
  emit("remove", props.item.plat.id);
};
</script>
