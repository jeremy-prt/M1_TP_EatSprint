import type { Restaurant } from "~/types/restaurant";

/**
 * GET /api/restaurants
 * Récupère la liste de tous les restaurants (endpoint public)
 * @query simulate-error - Mode simulation d'erreur pour les tests (dev uniquement)
 * @returns Restaurant[] - Liste de tous les restaurants
 * @throws 500 - Erreur serveur ou configuration manquante
 * @throws 503 - Service temporairement indisponible ou erreur simulée
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Mode simulation d'erreur pour les tests (dev uniquement)
  const query = getQuery(event);
  if (query["simulate-error"]) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simule un délai
    throw createError({
      statusCode: 503,
      statusMessage: "Erreur simulée pour les tests",
    });
  }

  // Vérification des variables d'environnement
  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error("Configuration Supabase manquante");
    throw createError({
      statusCode: 500,
      statusMessage: "Configuration du serveur incomplète",
    });
  }

  try {
    const response = await $fetch<Restaurant[]>(
      `${config.supabaseUrl}/rest/v1/restaurants`,
      {
        headers: {
          apikey: config.supabaseKey,
          Authorization: `Bearer ${config.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        // Timeout de 10 secondes
        timeout: 10000,
      },
    );

    // Vérification que la réponse est bien un tableau
    if (!Array.isArray(response)) {
      console.error("Format de réponse invalide:", response);
      throw createError({
        statusCode: 500,
        statusMessage: "Format de données invalide",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des restaurants:", {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    });

    // Erreur réseau ou timeout
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      throw createError({
        statusCode: 503,
        statusMessage: "Service temporairement indisponible",
      });
    }

    // Erreur d'authentification
    if (error.statusCode === 401 || error.statusCode === 403) {
      throw error;
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.message || "Erreur lors de la récupération des restaurants",
    });
  }
});
