const seed = async ({ strapi }: { strapi: any }) => {
  console.log("🚀 Lancement du seed...");

  // 🧹 Étape 1 : Suppression des produits existants
  await strapi.db.query("api::produit.produit").deleteMany({});
  console.log("🗑️ Produits supprimés");

  // 🧹 Étape 2 : Suppression des catégories existantes
  await strapi.db.query("api::categorie.categorie").deleteMany({});
  console.log("🗑️ Catégories supprimées");

  const categories = [
    { nom: "Soins capillaires", slug: "soins-capillaires" },
    { nom: "Perruques", slug: "perruques" },
    { nom: "Accessoires", slug: "accessoires" },
    { nom: "Tissages", slug: "tissages" },
    { nom: "Colorations", slug: "colorations" },
    { nom: "Entretien barbe", slug: "entretien-barbe" },
  ];

  const produitsParCategorie = {
    "soins-capillaires": [
      {
        nom: "Shampoing nourrissant",
        slug: "shampoing-nourrissant",
        description: "Shampoing enrichi au karité pour cheveux afro.",
        prix: 12.5,
        tva: 20,
      },
      {
        nom: "Masque réparateur",
        slug: "masque-reparateur",
        description: "Répare les cheveux cassants en profondeur.",
        prix: 18,
        tva: 20,
      },
    ],
    perruques: [
      {
        nom: "Perruque naturelle bouclée",
        slug: "perruque-naturelle-bouclee",
        description: "Perruque 100% cheveux naturels, texture bouclée.",
        prix: 150,
        tva: 20,
      },
      {
        nom: "Perruque lisse brésilienne",
        slug: "perruque-lisse-bresilienne",
        description: "Look professionnel et élégant.",
        prix: 180,
        tva: 20,
      },
    ],
    accessoires: [
      {
        nom: "Bonnet de nuit en satin",
        slug: "bonnet-nuit-satin",
        description: "Protège les cheveux pendant le sommeil.",
        prix: 8.5,
        tva: 20,
      },
      {
        nom: "Peigne afro",
        slug: "peigne-afro",
        description: "Idéal pour coiffer les cheveux texturés.",
        prix: 5,
        tva: 20,
      },
    ],
    tissages: [
      {
        nom: "Tissage ondulé",
        slug: "tissage-ondule",
        description: "Tissage 100% naturel pour un look ondulé.",
        prix: 55,
        tva: 20,
      },
      {
        nom: "Tissage lisse",
        slug: "tissage-lisse",
        description: "Tissage doux et facile à coiffer.",
        prix: 50,
        tva: 20,
      },
    ],
    colorations: [
      {
        nom: "Coloration acajou intense",
        slug: "coloration-acajou",
        description: "Couleur vibrante pour cheveux foncés.",
        prix: 9,
        tva: 20,
      },
      {
        nom: "Coloration caramel",
        slug: "coloration-caramel",
        description: "Apporte des reflets dorés et lumineux.",
        prix: 9,
        tva: 20,
      },
    ],
    "entretien-barbe": [
      {
        nom: "Huile à barbe nourrissante",
        slug: "huile-barbe",
        description: "Adoucit la barbe et stimule la pousse.",
        prix: 14,
        tva: 20,
      },
      {
        nom: "Brosse à barbe en poils naturels",
        slug: "brosse-barbe",
        description: "Démêle et discipline les poils de barbe.",
        prix: 10,
        tva: 20,
      },
    ],
  };

  for (const cat of categories) {
    const category = await strapi.entityService.create(
      "api::categorie.categorie",
      {
        data: cat,
      }
    );

    const produits = produitsParCategorie[cat.slug];
    for (const prod of produits) {
      await strapi.entityService.create("api::produit.produit", {
        data: {
          ...prod,
          category: category.id,
        },
      });
    }
  }

  console.log("✅ Seed terminé avec succès");
};

export default seed;
