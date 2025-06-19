export default {
  routes: [
    {
      method: "POST",
      path: "/checkout",
      handler: "api::checkout.checkout.checkout",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
