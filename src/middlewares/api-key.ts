export default (_config, { strapi }) => {
  return async (ctx, next) => {
    const url = ctx.request.url;
    const isDev = process.env.NODE_ENV !== "production";

    // On n'applique pas la vérif sur :
    // - les routes hors /api/
    // - en environnement de développement
    if (!url.startsWith("/api/") || isDev) {
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
