const seed = async ({ strapi }: { strapi: any }) => {
  console.log("🚀 Lancement du seed...");

  const category = await strapi.entityService.create(
    "api::categorie.categorie",
    {
      data: {
        nom: "Soins capillaires",
        slug: "soins-capillaires",
      },
    }
  );

  const produit = await strapi.entityService.create("api::produit.produit", {
    data: {
      nom: "Shampoing nourrissant",
      slug: "shampoing-nourrissant",
      description: "Shampoing enrichi au karité pour cheveux afro.",
      prix: 12.5,
      tva: 20,
      category: category.id,
    },
  });

  const commande = await strapi.entityService.create("api::commande.commande", {
    data: {
      prenom: "Léa",
      nom: "Mbemba",
      email: "lea@example.com",
      telephone: "0611223344",
      adresse_rue: "12 rue des Coiffeuses",
      code_postal: "75000",
      ville: "Paris",
      pays: "France",
      statut: "en_attente",
      total_commande: 25,
    },
  });

  await strapi.entityService.create("api::produit-commande.produit-commande", {
    data: {
      quantite: 2,
      prix_unitaire: 12.5,
      nom_produit: produit.nom,
      produit: produit.id,
      commande: commande.id,
    },
  });

  console.log("✅ Seed terminé avec succès");
};

export default seed;
