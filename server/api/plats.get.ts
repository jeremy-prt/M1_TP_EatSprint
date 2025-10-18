import type { Plat } from "~/types/plat";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Mode simulation d'erreur pour les tests (dev uniquement)
  const query = getQuery(event);
  if (query["simulate-error"]) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    let url = `${config.supabaseUrl}/rest/v1/plats`;

    // Filtre par restaurant_id si fourni
    if (query.restaurant_id) {
      url += `?restaurant_id=eq.${query.restaurant_id}`;
    }

    const response = await $fetch<Plat[]>(url, {
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

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
    console.error("Erreur lors de la récupération des plats:", {
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
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur d'authentification avec la base de données",
      });
    }

    // Erreur générique
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.message || "Erreur lors de la récupération des plats",
    });
  }
});
