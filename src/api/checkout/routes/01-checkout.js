module.exports = {
  routes: [
    {
      method: "POST",
      path: "/stripe/checkout",
      handler: "stripe.stripeCheckout",
      config: {
        auth: false,
      },
    },
  ],
};
