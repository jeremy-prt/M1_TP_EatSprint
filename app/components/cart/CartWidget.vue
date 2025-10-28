<template>
  <Transition name="slide-up">
    <NuxtLink
      v-if="!isEmpty"
      to="/panier"
      class="cart-widget group bg-secondary fixed right-6 bottom-6 z-40 -skew-x-6 cursor-pointer overflow-hidden shadow-[6px_6px_0_black] transition-all duration-300"
    >
      <div class="skew-x-6 px-6 py-4">
        <div class="flex items-center gap-4">
          <div class="relative">
            <Icon
              name="mdi:cart"
              size="32"
              class="text-white transition-transform"
            />
            <div
              class="bg-accent absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-[2px_2px_0_black]"
            >
              <span class="text-xs font-bold text-white">
                {{ itemsCount }}
              </span>
            </div>
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-semibold text-white uppercase">
              {{ $t('cart.widget.title') }}
            </span>
            <span class="text-xl font-extrabold text-white">
              {{ totalPrice.toFixed(2) }}€
            </span>
          </div>

          <Icon
            name="mdi:chevron-right"
            size="24"
            class="text-white transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </NuxtLink>
  </Transition>
</template>

<script setup lang="ts">
const { isEmpty, itemsCount, totalPrice } = useCart();
</script>

<style scoped>
.cart-widget {
  max-width: 280px;
}

.cart-widget:active {
  transform: skewX(-12deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 black;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: skewX(-6deg) translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: skewX(-6deg) translateY(20px);
}
</style>
