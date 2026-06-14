import {
  banners,
  dashboardKpis,
  feedbacks,
  notifications,
  products,
  promotions,
  settings,
  users,
  votes,
} from "@/mocks/data";
import type {
  Banner,
  DashboardKpis,
  Feedback,
  Notification,
  Product,
  Promotion,
  Settings,
  User,
  UserRole,
  Vote,
} from "@/types";

const delay = (ms = 350) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function loginMock(email: string, role: UserRole): Promise<User> {
  await delay();
  const user = users.find((item) => item.role === role);

  if (!user || !email.includes("@")) {
    throw new Error("Credenciais inválidas.");
  }

  return { ...user, email };
}

export async function getProducts(): Promise<Product[]> {
  await delay();
  return products;
}

export async function getVotes(): Promise<Vote[]> {
  await delay();
  return votes;
}

export async function getFeedbacks(): Promise<Feedback[]> {
  await delay();
  return feedbacks;
}

export async function getPromotions(): Promise<Promotion[]> {
  await delay();
  return promotions;
}

export async function getNotifications(): Promise<Notification[]> {
  await delay(200);
  return notifications;
}

export async function getBanners(): Promise<Banner[]> {
  await delay(200);
  return banners;
}

export async function getSettings(): Promise<Settings> {
  await delay(200);
  return settings;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  await delay();
  return dashboardKpis;
}
