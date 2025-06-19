export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: ["http://localhost:3000", "https://www.thunderclient.com"],
      headers: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "x-api-key",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Ajoutez cette ligne
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  {
    name: "global::api-key",
    config: {},
  },
];
