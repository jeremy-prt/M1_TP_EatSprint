import { watch, type ComputedRef, type Ref } from "vue";
import type { Plat } from "~/types/plat";
import type { Restaurant } from "~/types/restaurant";

export const useSeoPlat = (
  plat: ComputedRef<Plat | null | undefined> | Ref<Plat | null | undefined>,
  restaurant:
    | ComputedRef<Restaurant | null | undefined>
    | Ref<Restaurant | null | undefined>,
) => {
  watch(
    [plat, restaurant],
    ([currentPlat, currentRestaurant]) => {
      if (currentPlat && currentRestaurant) {
        // Meta tags classiques
        useSeoMeta({
          title: `${currentPlat.nom} - ${currentRestaurant.nom} | EatSprint`,
          description: `${currentPlat.description} - ${currentPlat.prix}€. Temps de préparation : ${currentPlat.temps_preparation_min} min. ${currentPlat.calories} cal. Commandez chez ${currentRestaurant.nom}.`,
          ogTitle: `${currentPlat.nom} - ${currentRestaurant.nom}`,
          ogDescription: currentPlat.description,
          ogImage: currentPlat.image,
          ogType: "website",
          twitterCard: "summary_large_image",
        });

        // Schema.org Product pour Google Rich Results via JSON-LD
        const schemaOrgProduct = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: currentPlat.nom,
          description: currentPlat.description,
          image: currentPlat.image,
          offers: {
            "@type": "Offer",
            price: currentPlat.prix,
            priceCurrency: "EUR",
            availability: currentPlat.disponible
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${currentPlat.calories} calories`,
          },
          aggregateRating: currentRestaurant.note
            ? {
                "@type": "AggregateRating",
                ratingValue: currentRestaurant.note,
                bestRating: "5",
              }
            : undefined,
        };

        useHead({
          htmlAttrs: {
            lang: "fr",
          },
          script: [
            {
              type: "application/ld+json",
              innerHTML: JSON.stringify(schemaOrgProduct),
            },
          ],
        });
      }
    },
    { immediate: true },
  );
};
