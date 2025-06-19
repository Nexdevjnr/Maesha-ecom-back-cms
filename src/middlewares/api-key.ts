export default (_config, { strapi }) => {
  return async (ctx, next) => {
    const url = ctx.request.url;
    const isDev = process.env.NODE_ENV !== "production";

    // N'appliquez pas la vérification sur:
    // - les routes hors /api/
    // - les routes de paiement
    // - en environnement de développement
    if (!url.startsWith("/api/") || url.includes("/payment/") || isDev) {
      return await next();
    }

    const apiKey = ctx.request.headers["x-api-key"];

    if (apiKey !== process.env.API_KEY) {
      strapi.log.warn("⛔ Clé API invalide !");
      return ctx.unauthorized("Invalid API key");
    }

    await next();
  };
};
