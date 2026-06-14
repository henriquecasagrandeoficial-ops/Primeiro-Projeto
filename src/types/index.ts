export type UserRole = "client" | "admin";

export type ProductCategory = "Bolos" | "Doces" | "Sobremesas" | "Salgados";

export type ProductStatus = "available" | "sold_out" | "inactive";

export type FeedbackCategory = "suggestion" | "complaint" | "compliment";

export type FeedbackStatus = "new" | "reviewing" | "resolved";

export type VoteStatus = "scheduled" | "active" | "closed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  preferences: {
    notifications: boolean;
    theme: "light" | "dark";
  };
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  price: number;
  imageUrl?: string;
  status: ProductStatus;
  featuredWeek: boolean;
  productOfDay: boolean;
  scheduledDay?: string;
  scheduledWeek?: {
    start: string;
    end: string;
  };
  createdAt: string;
}

export interface VoteOption {
  id: string;
  productName: string;
  votes: number;
  productId?: string;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: VoteStatus;
  options: VoteOption[];
  userVotedOptionId?: string;
  resultPublished: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  title: string;
  category: FeedbackCategory;
  message: string;
  status: FeedbackStatus;
  response?: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  validUntil: string;
  productIds: string[];
  active: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface Settings {
  bakeryName: string;
  logoUrl?: string;
  phone: string;
  whatsappUrl: string;
  instagramUrl: string;
  address: string;
  openingHours: string;
  heroBanner: Banner;
  institutionalText: string;
}

export interface DashboardKpis {
  totalProducts: number;
  activeProducts: number;
  totalVotes: number;
  receivedFeedbacks: number;
  topVotedProduct: string;
}
