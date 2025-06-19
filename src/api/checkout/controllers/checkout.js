"use strict";

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

module.exports = {
  async stripeCheckout(ctx) {
    try {
      const { clientInfo, panier } = ctx.request.body;

      if (!clientInfo || !Array.isArray(panier)) {
        return ctx.throw(400, "clientInfo ou panier manquant");
      }

      // Exemple simple (tu peux faire plus ensuite)
      const total = panier.reduce((acc, item) => acc + item.prix * item.qty, 0);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "eur",
        metadata: {
          client: clientInfo.email,
        },
      });

      ctx.body = {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      console.error("Stripe error:", err);
      ctx.throw(500, "Erreur lors du paiement");
    }
  },
};
