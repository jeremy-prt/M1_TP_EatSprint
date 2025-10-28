<template>
  <div>
    <LayoutHeader />
    <main
      class="bg-background-light min-h-screen pt-header"
      style="background-image: url('/images/patterns/background-pattern.svg'); background-repeat: repeat;"
    >
      <slot />
    </main>
    <CartWidget />
    <UiToast />
  </div>
</template>

<script setup lang="ts"></script>
