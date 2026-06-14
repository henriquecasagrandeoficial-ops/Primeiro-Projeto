import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

loadEnv(".env.local");

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const now = new Date().toISOString();

const seed = {
  products: [
    {
      id: "p-1",
      name: "Bolo de Festa Dona Lu",
      category: "Bolos",
      shortDescription: "Massa fofinha com recheio artesanal para celebrações.",
      fullDescription:
        "Bolo personalizado com massa de baunilha ou chocolate, recheio cremoso e acabamento artesanal.",
      ingredients: ["Farinha", "Ovos", "Leite", "Chocolate", "Creme especial"],
      price: 89.9,
      imageUrl: "/IMG/Bolodefesta.png",
      status: "available",
      badges: ["best_seller", "weekly"],
      promotionLabel: "Mais vendido",
      views: 348,
      favoriteCount: 76,
      featuredWeek: true,
      productOfDay: false,
      createdAt: "2026-06-01",
      updatedAt: now,
    },
    {
      id: "p-2",
      name: "Bolo de Pote",
      category: "Bolos",
      shortDescription: "Camadas cremosas em porção individual.",
      fullDescription:
        "Sobremesa gelada com massa macia, recheio generoso e cobertura finalizada no pote.",
      ingredients: ["Massa de bolo", "Leite condensado", "Chocolate", "Creme"],
      price: 14.9,
      imageUrl: "/IMG/Bolodepote.png",
      status: "available",
      badges: ["promotion", "new"],
      promotionLabel: "Combo com 10% off",
      views: 284,
      favoriteCount: 61,
      featuredWeek: false,
      productOfDay: true,
      scheduledDay: "2026-06-14",
      createdAt: "2026-06-02",
      updatedAt: now,
    },
    {
      id: "p-3",
      name: "Brigadeiro Tradicional",
      category: "Doces",
      shortDescription: "Clássico brasileiro com granulado belga.",
      fullDescription:
        "Brigadeiro enrolado à mão com chocolate selecionado e textura cremosa.",
      ingredients: ["Leite condensado", "Chocolate", "Manteiga", "Granulado"],
      price: 4.5,
      imageUrl: "/IMG/brigadeiro.png",
      status: "available",
      badges: ["best_seller", "weekly"],
      promotionLabel: "Leve 12 pague 10",
      views: 512,
      favoriteCount: 118,
      featuredWeek: true,
      productOfDay: false,
      createdAt: "2026-06-03",
      updatedAt: now,
    },
  ],
  media: [
    {
      id: "media-1",
      name: "Bolo de Festa Dona Lu",
      url: "/IMG/Bolodefesta.png",
      type: "image/png",
      usage: "product",
      createdAt: "2026-06-01",
    },
    {
      id: "media-2",
      name: "Bolo de Pote",
      url: "/IMG/Bolodepote.png",
      type: "image/png",
      usage: "product",
      createdAt: "2026-06-02",
    },
    {
      id: "media-3",
      name: "Brigadeiro Tradicional",
      url: "/IMG/brigadeiro.png",
      type: "image/png",
      usage: "product",
      createdAt: "2026-06-03",
    },
  ],
  votes: [
    {
      id: "v-1",
      title: "Produto especial de julho",
      description: "Escolha o doce que deve entrar como edição especial no próximo mês.",
      startDate: "2026-06-10",
      endDate: "2026-06-30",
      status: "active",
      resultPublished: false,
      totalVotes: 107,
      options: [
        { id: "vo-1", productName: "Brigadeiro Pistache", votes: 42 },
        { id: "vo-2", productName: "Cheesecake de Morango", votes: 36 },
        { id: "vo-3", productName: "Torta de Limão", votes: 29 },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ],
  feedbacks: [
    {
      id: "f-1",
      userId: process.env.SEED_CLIENT_UID ?? "client-1",
      title: "Mais opções sem lactose",
      category: "suggestion",
      message: "Seria ótimo ter bolos pequenos sem lactose no cardápio.",
      status: "reviewing",
      createdAt: "2026-06-12",
    },
  ],
  promotions: [
    {
      id: "promo-1",
      title: "Semana dos Bolos Caseiros",
      description: "10% off nos bolos de café da manhã até domingo.",
      validUntil: "2026-06-21",
      productIds: ["p-1", "p-2"],
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  notifications: [
    {
      id: "n-1",
      userId: "all",
      type: "vote_result",
      title: "Nova votação disponível",
      message: "Vote no próximo produto especial da doceria.",
      read: false,
      createdAt: "2026-06-14",
    },
  ],
  coupons: [
    {
      id: "c-1",
      code: "DONA10",
      title: "Primeira encomenda",
      description: "Ganhe desconto em bolos e doces para sua primeira encomenda.",
      discount: "10%",
      validUntil: "2026-06-30",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  settings: [
    {
      id: "main",
      bakeryName: "Doceria Dona Lu",
      logoUrl: "/IMG/Logo-Doceria.png",
      phone: "(11) 98633-7175",
      whatsappUrl: "https://api.whatsapp.com/send?phone=5511986337175",
      instagramUrl: "https://www.instagram.com/doceriadonaluoficial",
      facebookUrl: "https://www.facebook.com/doceriadonalu",
      tiktokUrl: "https://www.tiktok.com/@doceriadonalu",
      customLinks: [
        { label: "Encomendas", url: "https://api.whatsapp.com/send?phone=5511986337175" },
        { label: "Localização", url: "https://www.google.com.br/maps" },
      ],
      address: "Rua João Batista da Silva, 65",
      openingHours: "Segunda a sábado, das 9h às 18h",
      institutionalText:
        "A Doceria Dona Lu transforma momentos simples em memórias doces com receitas artesanais, cuidado familiar e sabor de casa.",
      heroBanner: {
        id: "banner-1",
        title: "Celebre os momentos doces da vida",
        subtitle: "Promoções da semana, produtos artesanais e encomendas feitas com carinho.",
        ctaLabel: "Ver cardápio",
        ctaHref: "/cliente/cardapio",
      },
      updatedAt: now,
    },
  ],
};

const userProfiles = [
  process.env.SEED_ADMIN_UID
    ? {
        id: process.env.SEED_ADMIN_UID,
        fullName: "Admin Dona Lu",
        name: "Admin Dona Lu",
        email: process.env.SEED_ADMIN_EMAIL ?? "admin@doceria.com",
        phone: "(11) 99999-2222",
        avatar: "",
        avatarUrl: "",
        role: "admin",
        marketingConsent: false,
        preferences: { notifications: true, theme: "light" },
        createdAt: now,
        updatedAt: now,
      }
    : null,
  process.env.SEED_CLIENT_UID
    ? {
        id: process.env.SEED_CLIENT_UID,
        fullName: "Cliente Dona Lu",
        name: "Cliente Dona Lu",
        email: process.env.SEED_CLIENT_EMAIL ?? "cliente@doceria.com",
        phone: "(11) 99999-1111",
        avatar: "",
        avatarUrl: "",
        role: "client",
        marketingConsent: true,
        preferences: { notifications: true, theme: "light" },
        createdAt: now,
        updatedAt: now,
      }
    : null,
].filter(Boolean);

for (const [collectionName, items] of Object.entries(seed)) {
  for (const item of items) {
    await setDoc(doc(db, collectionName, item.id), stripId(item));
  }
}

for (const profile of userProfiles) {
  await setDoc(doc(db, "users", profile.id), stripId(profile));
}

console.log("Seed concluido.");

function stripId(item) {
  const { id, ...data } = item;
  return data;
}

function loadEnv(path) {
  const content = readFileSync(path, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key] = valueParts.join("=");
  }
}
