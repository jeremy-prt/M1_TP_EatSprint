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
  const baseUrl = "https://m1-tp-eat-sprint.vercel.app";

  const title = computed(() => {
    if (!restaurant.value) return "EatSprint";
    return `${restaurant.value.nom} - Menu et Plats | EatSprint`;
  });

  const description = computed(() => {
    if (!restaurant.value) return "";
    return `Découvrez le menu complet de ${restaurant.value.nom} à ${restaurant.value.ville}. Note : ${restaurant.value.note}/5. Commandez en ligne pour une livraison rapide.`;
  });

  const ogTitle = computed(() => {
    if (!restaurant.value) return "";
    return `${restaurant.value.nom} - Menu et Plats | EatSprint`;
  });

  const ogDescription = computed(() => {
    if (!restaurant.value) return "";
    return `Découvrez le menu de ${restaurant.value.nom} à ${restaurant.value.ville}. Note : ${restaurant.value.note}/5`;
  });

  const ogImage = computed(() => restaurant.value?.image || "");

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt: () => restaurant.value?.nom || "",
    ogUrl: () => `${baseUrl}${route.fullPath}`,
    ogType: "website",
    ogSiteName: "EatSprint",
    twitterCard: "summary_large_image",
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: ogImage,
  });

  useHead({
    htmlAttrs: {
      lang: "fr",
    },
  });
};
