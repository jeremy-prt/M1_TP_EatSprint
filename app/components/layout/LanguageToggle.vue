<template>
  <button
    @click="toggleLocale"
    class="relative bottom-[3px] flex h-12 w-24 items-center rounded-full bg-white/80 p-1 shadow-[4px_4px_0_black] transition-all duration-500"
    :aria-label="locale === 'fr' ? 'Switch to English' : 'Passer en français'"
  >
    <div
      :class="[
        'bg-secondary absolute z-0 h-10 w-10 rounded-full shadow-[2px_2px_0_black] transition-all duration-500 ease-out',
        locale === 'fr' ? 'left-1' : 'left-[calc(100%-2.75rem)]',
      ]"
    ></div>

    <Icon
      name="twemoji:flag-france"
      class="absolute top-1/2 left-3.5 z-10 h-5 w-5 -translate-y-1/2"
    />
    <Icon
      name="twemoji:flag-united-kingdom"
      class="absolute top-1/2 right-[13px] z-10 h-5 w-5 -translate-y-1/2"
    />
  </button>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useI18n();
const route = useRoute();
const toast = useToast();

const isBackoffice = computed(() => {
  return (
    route.path.startsWith("/admin") ||
    route.path.startsWith("/restaurant-owner")
  );
});

const showBackofficeWarning = () => {
  toast.warning(t("nav.backofficeNoTranslation"));
};

const toggleLocale = () => {
  if (isBackoffice.value && locale.value === "fr") {
    showBackofficeWarning();
    return;
  }

  setLocale(locale.value === "fr" ? "en" : "fr");
};

watch(
  () => route.path,
  (newPath) => {
    const isEnteringBackoffice =
      newPath.startsWith("/admin") || newPath.startsWith("/restaurant-owner");

    if (isEnteringBackoffice && locale.value === "en") {
      setLocale("fr");
      showBackofficeWarning();
    }
  },
);
</script>
