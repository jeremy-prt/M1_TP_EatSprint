<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))]">
    <div class="container mx-auto max-w-4xl px-6 py-12">
      <div class="space-y-6 text-gray-700">
        <section>
          <h2 class="text-accent mb-3 text-2xl font-bold">
            Page de démonstration
          </h2>
          <p class="leading-relaxed">
            Cette page a été créée uniquement pour illustrer la navigation du
            site et éviter les erreurs 404. Elle ne contient pas de véritable
            contenu sur l'histoire d'EatSprint, car il s'agit d'un projet
            académique de démonstration.
          </p>
        </section>

        <section>
          <h2 class="text-accent mb-3 text-2xl font-bold">Projet EatSprint</h2>
          <p class="mb-4 leading-relaxed">
            EatSprint est une application de livraison de repas développée dans
            le cadre d'un projet pédagogique. L'objectif principal est de
            démontrer les compétences techniques suivantes :
          </p>
          <ul class="space-y-2 pl-6">
            <li class="list-disc">
              Architecture Nuxt 4 avec SSR et CSR optimisés
            </li>
            <li class="list-disc">
              Gestion d'état avec Pinia et authentification
            </li>
            <li class="list-disc">Back-office admin et restaurant owner</li>
            <li class="list-disc">Design moderne avec Tailwind CSS v4</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Notre Histoire - EatSprint",
  description: "Page de démonstration du projet EatSprint",
  ogTitle: "Notre Histoire - EatSprint",
  ogDescription: "Page de démonstration du projet EatSprint",
  ogImage: "/assets/logo_new.png",
  ogType: "website",
  twitterCard: "summary_large_image",
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
});
</script>
