<template>
  <OrderSkeleton v-if="loading" />

  <OrderEmpty v-else-if="orders.length === 0" />

  <div v-else class="space-y-6">
    <div
      v-for="order in orders"
      :key="order.id"
      class="-skew-x-3 border-4 border-black bg-white/70 shadow-[6px_6px_0_black] backdrop-blur-xs transition-all"
    >
      <div class="skew-x-3 p-6">
        <div
          class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4"
        >
          <div>
            <h3 class="text-lg font-bold text-gray-800">
              {{ $t('orders.orderNumber') }}{{ order.id }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ formatDate(order.created_at) }}
            </p>
          </div>
          <div class="text-right">
            <span
              class="inline-block rounded px-3 py-1 text-sm font-semibold"
              :class="getStatusClass(order.statut)"
            >
              {{ getStatusLabel(order.statut) }}
            </span>
            <p class="text-accent mt-2 text-2xl font-extrabold">
              {{ order.total.toFixed(2) }}€
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between text-sm"
          >
            <div class="flex items-center gap-3">
              <span class="font-semibold text-gray-700"
                >{{ item.quantity }}x</span
              >
              <span class="text-gray-800">{{
                item.plat?.nom || $t('orders.unknownDish')
              }}</span>
            </div>
            <span class="font-semibold text-gray-700">
              {{ (item.prix_unitaire * item.quantity).toFixed(2) }}€
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderWithItems, OrderStatus } from "~/types/order";

const { t, locale } = useI18n()

defineProps<{
  orders: OrderWithItems[];
  loading: boolean;
}>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusLabel = (status: OrderStatus): string => {
  return t(`orders.status.${status}`, status);
};

const getStatusClass = (status: OrderStatus): string => {
  const classes: Record<OrderStatus, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    confirmee: "bg-blue-100 text-blue-800",
    en_preparation: "bg-purple-100 text-purple-800",
    en_livraison: "bg-orange-100 text-orange-800",
    livree: "bg-green-100 text-green-800",
    annulee: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};
</script>
