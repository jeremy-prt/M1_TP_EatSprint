<template>
  <header
    class="h-header bg-secondary fixed top-0 z-50 w-full overflow-visible"
  >
    <div class="container mx-auto h-full px-4">
      <nav
        class="grid h-full grid-cols-3 items-center text-xl font-bold uppercase"
      >
        <div class="flex items-center gap-6 justify-self-start">
          <NuxtLink
            to="/restaurants"
            class="group relative text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <span class="relative z-10">Nos restaurants</span>
          </NuxtLink>
          <NuxtLink
            to="/histoire"
            class="group relative text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <span class="relative z-10">Notre histoire</span>
          </NuxtLink>
        </div>

        <NuxtLink
          to="/"
          class="relative z-10 justify-self-center transition-transform duration-300 hover:scale-110"
        >
          <NuxtImg
            src="/assets/logo_new.png"
            alt="EatSprint Logo"
            class="relative top-6 h-20 w-auto"
          />
        </NuxtLink>

        <div class="flex items-center gap-6 justify-self-end">
          <NuxtLink
            to="/mon-espace-perso"
            class="group relative text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <span class="relative z-10">Mon espace perso</span>
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="group relative text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <span class="relative z-10">Contact</span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts"></script>
