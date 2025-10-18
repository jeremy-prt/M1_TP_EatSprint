<template>
  <div>
    <LayoutHeader />
    <main
      class="bg-background-light pt-header"
      style="background-image: url('/images/patterns/background-pattern.svg'); background-repeat: repeat;"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
