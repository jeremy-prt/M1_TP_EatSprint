import { computed, type ComputedRef, type Ref } from "vue";
import type { Restaurant } from "~/types/restaurant";

/**
 * Composable pour gérer les meta tags SEO d'une page restaurant
 * Configure automatiquement title, description, Open Graph et Twitter Card
 * @param restaurant - Ref ou ComputedRef du restaurant
 */
export const useSeoRestaurant = (
  restaurant: ComputedRef<Restaurant | undefined> | Ref<Restaurant | undefined>,
) => {
  const route = useRoute();
  const { locale, t } = useI18n();
  const baseUrl = "https://m1-tp-eat-sprint.vercel.app";

  const title = computed(() => {
    if (!restaurant.value) return "EatSprint";
    return `${restaurant.value.nom} - ${t('seo.restaurant.titleSuffix')}`;
  });

  const description = computed(() => {
    if (!restaurant.value) return "";
    return t('seo.restaurant.description', {
      name: restaurant.value.nom,
      city: restaurant.value.ville,
      rating: restaurant.value.note
    });
  });

  const ogTitle = computed(() => {
    if (!restaurant.value) return "";
    return `${restaurant.value.nom} - ${t('seo.restaurant.titleSuffix')}`;
  });

  const ogDescription = computed(() => {
    if (!restaurant.value) return "";
    return t('seo.restaurant.ogDescription', {
      name: restaurant.value.nom,
      city: restaurant.value.ville,
      rating: restaurant.value.note
    });
  });

  const ogImage = computed(() => restaurant.value?.image || "");

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => ogTitle.value,
    ogDescription: () => ogDescription.value,
    ogImage: () => ogImage.value,
    ogImageAlt: () => restaurant.value?.nom || "",
    ogUrl: () => `${baseUrl}${route.fullPath}`,
    ogType: "website",
    ogSiteName: "EatSprint",
    twitterCard: "summary_large_image",
    twitterTitle: () => ogTitle.value,
    twitterDescription: () => ogDescription.value,
    twitterImage: () => ogImage.value,
  });

  useHead({
    htmlAttrs: {
      lang: () => locale.value,
    },
  });
};
