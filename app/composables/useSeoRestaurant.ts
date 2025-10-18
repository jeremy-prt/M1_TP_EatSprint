import { watch, type ComputedRef, type Ref } from "vue";
import type { Restaurant } from "~/types/restaurant";

export const useSeoRestaurant = (
  restaurant: ComputedRef<Restaurant | undefined> | Ref<Restaurant | undefined>,
) => {
  watch(
    restaurant,
    (resto) => {
      if (resto) {
        const route = useRoute();
        const baseUrl = "https://m1-tp-eat-sprint.vercel.app";
        const fullUrl = `${baseUrl}${route.fullPath}`;

        useSeoMeta({
          title: `${resto.nom} - Menu et Plats | EatSprint`,
          description: `Découvrez le menu complet de ${resto.nom} à ${resto.ville}. Note : ${resto.note}/5. Commandez en ligne pour une livraison rapide.`,
          ogTitle: `${resto.nom} - Menu et Plats | EatSprint`,
          ogDescription: `Découvrez le menu de ${resto.nom} à ${resto.ville}. Note : ${resto.note}/5`,
          ogImage: resto.image,
          ogImageAlt: resto.nom,
          ogUrl: fullUrl,
          ogType: "website",
          ogSiteName: "EatSprint",
          twitterCard: "summary_large_image",
          twitterTitle: `${resto.nom} - Menu et Plats | EatSprint`,
          twitterDescription: `Découvrez le menu de ${resto.nom} à ${resto.ville}`,
          twitterImage: resto.image,
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
