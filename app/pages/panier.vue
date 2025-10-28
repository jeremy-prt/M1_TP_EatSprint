<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))] py-12">
    <div class="container mx-auto max-w-5xl px-6">
      <h1
        class="text-primary mb-8 text-center text-5xl font-extrabold uppercase md:text-6xl"
      >
        Mon Panier
      </h1>

      <CartEmpty v-if="isEmpty" />

      <div v-else class="space-y-8">
        <div class="space-y-4">
          <CartItem
            v-for="item in items"
            :key="item.plat.id"
            :item="item"
            @decrement="handleDecrement"
            @increment="handleIncrement"
            @remove="handleRemove"
          />
        </div>

        <CartSummary :total-price="totalPrice" :is-ordering="isOrdering" @clear="handleClear" @order="handleOrder" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isEmpty, items, totalPrice, decrementQuantity, incrementQuantity, removeItem, clearCart } = useCart()
const orderStore = useOrderStore()
const toast = useToast()
const isOrdering = ref(false)

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Mon Panier - EatSprint',
  description: 'Consultez et modifiez les articles de votre panier',
  ogTitle: 'Mon Panier - EatSprint',
  ogDescription: 'Consultez et modifiez les articles de votre panier',
  ogImage: '/assets/logo_new.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'fr',
  },
})

const handleDecrement = (platId: number) => {
  decrementQuantity(platId)
}

const handleIncrement = (platId: number) => {
  incrementQuantity(platId)
}

const handleRemove = (platId: number) => {
  const item = items.value.find((i) => i.plat.id === platId)
  if (item) {
    removeItem(platId)
    toast.success(`${item.plat.nom} retiré du panier`)
  }
}

const handleClear = () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    clearCart()
    toast.success('Panier vidé')
  }
}

const handleOrder = async () => {
  if (isOrdering.value) return

  isOrdering.value = true

  try {
    const orderData = {
      items: items.value.map((item) => ({
        plat_id: item.plat.id,
        quantity: item.quantity,
        prix_unitaire: item.plat.prix,
      })),
      total: totalPrice.value,
    }

    await orderStore.createOrder(orderData)

    clearCart()

    toast.success('Commande passée avec succès !')

    navigateTo('/mon-espace-perso')
  } catch (error: any) {
    console.error('Erreur lors de la commande:', error)
    toast.error(error.data?.message || 'Erreur lors de la commande')
  } finally {
    isOrdering.value = false
  }
}
</script>

