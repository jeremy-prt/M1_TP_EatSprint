<template>
  <div
    id="background"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
  >
    <DecorativeFoodIconsBackground />

    <div class="relative z-10 max-w-5xl text-center">
      <h1
        class="mb-6 text-6xl leading-none font-extrabold text-white uppercase md:text-7xl lg:text-8xl"
      >
        C'est l'heure de se faire plaisir
      </h1>

      <p class="text-text mb-8 text-xl font-normal md:text-2xl">
        Commandez dans vos restaurants favoris et faites-vous livrer rapidement
      </p>

      <UiButtonHighlight to="/restaurants">
        Découvrir nos restaurants
      </UiButtonHighlight>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  ssr: false,
  layout: false,
});
</script>

<style scoped>
#background {
  background-image:
    url("~/assets/images/patterns/bg-pattern.svg"),
    linear-gradient(135deg, #f97316, #ef6344);
  background-position: center;
  background-size: cover;
  background-repeat: repeat;
}
</style>
