<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))]">
    <div class="container mx-auto max-w-4xl px-6 py-12">
      <div class="space-y-6 text-gray-700">
        <section>
          <h2 class="text-accent mb-3 text-2xl font-bold">
            Page de démonstration
          </h2>
          <p class="leading-relaxed">
            Cette page de contact a été créée uniquement pour illustrer la
            navigation du site et éviter les erreurs 404. Aucun formulaire de
            contact fonctionnel n'est disponible, car il s'agit d'un projet
            académique de démonstration.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Contact - EatSprint",
  description: "Page de démonstration du projet EatSprint",
  ogTitle: "Contact - EatSprint",
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
