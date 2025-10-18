import { watch, type ComputedRef, type Ref } from "vue";
import type { Restaurant } from "~/types/restaurant";

export const useSeoRestaurant = (
  restaurant: ComputedRef<Restaurant | undefined> | Ref<Restaurant | undefined>,
) => {
  watch(
    restaurant,
    (resto) => {
      if (resto) {
        useSeoMeta({
          title: `${resto.nom} - Menu et Plats | EatSprint`,
          description: `Découvrez le menu complet de ${resto.nom} à ${resto.ville}. Note : ${resto.note}/5. Commandez en ligne pour une livraison rapide.`,
          ogTitle: `${resto.nom} - Menu et Plats | EatSprint`,
          ogDescription: `Découvrez le menu de ${resto.nom} à ${resto.ville}. Note : ${resto.note}/5`,
          ogImage: resto.image,
          ogType: "restaurant",
          twitterCard: "summary_large_image",
        });

        useHead({
          htmlAttrs: {
            lang: "fr",
          },
        });
      }
    },
    { immediate: true },
  );
};
