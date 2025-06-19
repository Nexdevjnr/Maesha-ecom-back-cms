import { factories } from "@strapi/strapi";
import Stripe from "stripe";

export default factories.createCoreController(
  "api::commande.commande",
  ({ strapi }) => ({
    async createCommande(ctx) {
      try {
        const { items, customerInfo } = ctx.request.body;

        if (!items || !customerInfo) {
          return ctx.badRequest("Infos manquantes (produits ou client)");
        }

        console.log("✅ Données reçues :", { items, customerInfo });

        // 1. Création de la commande
        const commande = await strapi.entityService.create(
          "api::commande.commande",
          {
            data: {
              ...customerInfo,
              statut: "en_attente", // à adapter selon ton enum
            },
          }
        );

        console.log("✅ Commande créée avec ID :", commande.id);

        // 2. Création des lignes Produit_Commande
        for (const item of items) {
          await strapi.entityService.create(
            "api::produit-commande.produit-commande",
            {
              data: {
                quantite: item.quantity,
                prix_unitaire: item.prix, // ou `item.unit_price` selon ton front
                nom_produit: item.nom,
                image: item.image, // assure-toi qu'il s'agit bien d'un `id` de média ou un upload préalable
                produit: item.id, // relation vers Produit
                commande: commande.id, // relation vers Commande
              },
            }
          );
          console.log(`🛒 Produit_Commande créé pour produit ${item.id}`);
        }

        return ctx.send({
          message: "Commande enregistrée",
          commandeId: commande.id,
        });
      } catch (error) {
        console.error("❌ Erreur création commande :", error);
        return ctx.internalServerError(
          "Erreur lors de l'enregistrement de la commande"
        );
      }
    },

    async checkout(ctx) {
      try {
        const { items, customerInfo } = ctx.request.body;

        if (!items || !items.length) {
          return ctx.badRequest("Aucun article dans le panier");
        }

        console.log("💳 Traitement paiement pour :", { items, customerInfo });

        // Initialiser Stripe avec votre clé secrète
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2025-05-28.basil",
        });

        // Créer les line items pour Stripe à partir des articles du panier
        const lineItems = items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.nom,
            },
            unit_amount: Math.round(item.prix * 100), // Stripe utilise les centimes
          },
          quantity: item.qty || item.quantity || 1,
        }));

        // Création d'une session de paiement Stripe
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `http://localhost:3000/commande/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `http://localhost:3000/panier`,
          customer_email: customerInfo?.email,
          metadata: {
            customerName: `${customerInfo.prenom} ${customerInfo.nom}`,
            telephone: customerInfo.telephone,
          },
        });

        console.log("✅ Session de paiement créée:", session.id);

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("❌ Erreur lors de la création du paiement:", error);
        return ctx.badRequest("Erreur lors de la création du paiement", {
          error: error.message,
        });
      }
    },
  })
);
