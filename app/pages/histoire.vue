<template>
  <div class="relative min-h-[calc(100vh-var(--spacing-header))]">
    <div class="container mx-auto max-w-4xl px-6 py-12">
      <div class="space-y-6 text-gray-700">
        <section>
          <h2 class="text-accent mb-3 text-2xl font-bold">
            {{ $t("story.demo.title") }}
          </h2>
          <p class="leading-relaxed">
            {{ $t("story.demo.description") }}
          </p>
        </section>

        <section>
          <h2 class="text-accent mb-3 text-2xl font-bold">
            {{ $t("story.project.title") }}
          </h2>
          <p class="mb-4 leading-relaxed">
            {{ $t("story.project.description") }}
          </p>
          <ul class="space-y-2 pl-6">
            <li class="list-disc">
              {{ $t("story.project.features.architecture") }}
            </li>
            <li class="list-disc">
              {{ $t("story.project.features.stateManagement") }}
            </li>
            <li class="list-disc">
              {{ $t("story.project.features.backoffice") }}
            </li>
            <li class="list-disc">{{ $t("story.project.features.design") }}</li>
          </ul>
        </section>

        <section>
          <h2 class="text-accent mb-3 text-2xl font-bold">
            {{ $t("story.testAccounts.title") }}
          </h2>
          <p class="mb-4 leading-relaxed">
            {{ $t("story.testAccounts.description") }}
          </p>
          <div class="space-y-4">
            <div>
              <h3 class="mb-2 font-semibold">
                {{ $t("story.testAccounts.admin.title") }}
              </h3>
              <p class="text-sm">{{ $t("story.testAccounts.admin.email") }}</p>
              <p class="text-sm">
                {{ $t("story.testAccounts.admin.password") }}
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">
                {{ $t("story.testAccounts.restaurantOwner.title") }}
              </h3>
              <p class="text-sm">
                {{ $t("story.testAccounts.restaurantOwner.email") }}
              </p>
              <p class="text-sm">
                {{ $t("story.testAccounts.restaurantOwner.password") }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

useSeoMeta({
  title: () => t("pages.story.title"),
  description: () => t("pages.story.description"),
  ogTitle: () => t("pages.story.ogTitle"),
  ogDescription: () => t("pages.story.ogDescription"),
  ogImage: "/assets/logo_new.png",
  ogType: "website",
  twitterCard: "summary_large_image",
});

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
});
</script>
