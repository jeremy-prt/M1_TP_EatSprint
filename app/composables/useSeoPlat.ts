import { computed, type ComputedRef, type Ref } from "vue";
import type { Plat } from "~/types/plat";
import type { Restaurant } from "~/types/restaurant";

/**
 * Composable pour gérer les meta tags SEO d'une page plat
 * Configure automatiquement title, description, Open Graph, Twitter Card et Schema.org JSON-LD
 * Le Schema.org Product permet l'affichage de rich snippets dans les résultats Google
 * @param plat - Ref ou ComputedRef du plat
 * @param restaurant - Ref ou ComputedRef du restaurant parent
 */
export const useSeoPlat = (
  plat: ComputedRef<Plat | null | undefined> | Ref<Plat | null | undefined>,
  restaurant:
    | ComputedRef<Restaurant | null | undefined>
    | Ref<Restaurant | null | undefined>,
) => {
  const route = useRoute();
  const { locale, t } = useI18n();
  const baseUrl = "https://m1-tp-eat-sprint.vercel.app";

  const title = computed(() => {
    if (!plat.value || !restaurant.value) return "EatSprint";
    return `${plat.value.nom} - ${restaurant.value.nom} | EatSprint`;
  });

  const description = computed(() => {
    if (!plat.value || !restaurant.value) return "";
    return t('seo.plat.description', {
      description: plat.value.description,
      price: plat.value.prix,
      time: plat.value.temps_preparation_min,
      calories: plat.value.calories,
      restaurant: restaurant.value.nom
    });
  });

  const ogImage = computed(() => plat.value?.image || "");
  const ogTitle = computed(() => {
    if (!plat.value || !restaurant.value) return "";
    return `${plat.value.nom} - ${restaurant.value.nom}`;
  });

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => ogTitle.value,
    ogDescription: () => plat.value?.description || "",
    ogImage: () => ogImage.value,
    ogImageAlt: () => plat.value?.nom || "",
    ogUrl: () => `${baseUrl}${route.fullPath}`,
    ogType: "website",
    ogSiteName: "EatSprint",
    twitterCard: "summary_large_image",
    twitterTitle: () => ogTitle.value,
    twitterDescription: () => plat.value?.description || "",
    twitterImage: () => ogImage.value,
  });

  // Schema.org Product pour Google Rich Results via JSON-LD
  const schemaOrgProduct = computed(() => {
    if (!plat.value || !restaurant.value) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: plat.value.nom,
      description: plat.value.description,
      image: plat.value.image,
      offers: {
        "@type": "Offer",
        price: plat.value.prix,
        priceCurrency: "EUR",
        availability: plat.value.disponible
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
      nutrition: {
        "@type": "NutritionInformation",
        calories: `${plat.value.calories} calories`,
      },
      aggregateRating: restaurant.value.note
        ? {
            "@type": "AggregateRating",
            ratingValue: restaurant.value.note,
            bestRating: "5",
          }
        : undefined,
    };
  });

  useHead({
    htmlAttrs: {
      lang: () => locale.value,
    },
    script: [
      {
        type: "application/ld+json",
        innerHTML: () => JSON.stringify(schemaOrgProduct.value),
      },
    ],
  });
};
