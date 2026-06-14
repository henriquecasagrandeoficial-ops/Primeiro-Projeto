import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  feedbacks,
  notifications,
  products,
  promotions,
  settings,
  votes,
} from "@/mocks/data";
import type {
  Feedback,
  FeedbackStatus,
  Product,
  ProductStatus,
  Promotion,
  Settings,
  User,
  Vote,
} from "@/types";

type AppState = {
  user: User | null;
  sidebarOpen: boolean;
  products: Product[];
  votes: Vote[];
  feedbacks: Feedback[];
  promotions: Promotion[];
  notifications: typeof notifications;
  settings: Settings;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  bulkUpdateProducts: (ids: string[], status: ProductStatus) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  addVote: (vote: Vote) => void;
  addVoteOption: (voteId: string, productName: string) => void;
  closeVote: (voteId: string) => void;
  publishVoteResult: (voteId: string) => void;
  vote: (voteId: string, optionId: string) => void;
  addFeedback: (feedback: Feedback) => void;
  updateFeedbackStatus: (id: string, status: FeedbackStatus, response?: string) => void;
  addPromotion: (promotion: Promotion) => void;
  addNotification: (notification: (typeof notifications)[number]) => void;
  updateSettings: (nextSettings: Settings) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      sidebarOpen: true,
      products,
      votes,
      feedbacks,
      promotions,
      notifications,
      settings,
      setUser: (user) => set({ user }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((item) =>
            item.id === product.id ? product : item,
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== id),
        })),
      duplicateProduct: (id) =>
        set((state) => {
          const product = state.products.find((item) => item.id === id);
          if (!product) return state;

          return {
            products: [
              {
                ...product,
                id: crypto.randomUUID(),
                name: `${product.name} (cópia)`,
                createdAt: new Date().toISOString().slice(0, 10),
              },
              ...state.products,
            ],
          };
        }),
      bulkUpdateProducts: (ids, status) =>
        set((state) => ({
          products: state.products.map((product) =>
            ids.includes(product.id) ? { ...product, status } : product,
          ),
        })),
      bulkDeleteProducts: (ids) =>
        set((state) => ({
          products: state.products.filter((product) => !ids.includes(product.id)),
        })),
      addVote: (vote) => set((state) => ({ votes: [vote, ...state.votes] })),
      addVoteOption: (voteId, productName) =>
        set((state) => ({
          votes: state.votes.map((voteItem) =>
            voteItem.id === voteId
              ? {
                  ...voteItem,
                  options: [
                    ...voteItem.options,
                    { id: crypto.randomUUID(), productName, votes: 0 },
                  ],
                }
              : voteItem,
          ),
        })),
      closeVote: (voteId) =>
        set((state) => ({
          votes: state.votes.map((voteItem) =>
            voteItem.id === voteId ? { ...voteItem, status: "closed" } : voteItem,
          ),
        })),
      publishVoteResult: (voteId) =>
        set((state) => ({
          votes: state.votes.map((voteItem) =>
            voteItem.id === voteId
              ? { ...voteItem, resultPublished: true, status: "closed" }
              : voteItem,
          ),
        })),
      vote: (voteId, optionId) =>
        set((state) => ({
          votes: state.votes.map((voteItem) => {
            if (voteItem.id !== voteId || voteItem.userVotedOptionId) {
              return voteItem;
            }

            return {
              ...voteItem,
              userVotedOptionId: optionId,
              options: voteItem.options.map((option) =>
                option.id === optionId
                  ? { ...option, votes: option.votes + 1 }
                  : option,
              ),
            };
          }),
        })),
      addFeedback: (feedback) =>
        set((state) => ({ feedbacks: [feedback, ...state.feedbacks] })),
      updateFeedbackStatus: (id, status, response) =>
        set((state) => ({
          feedbacks: state.feedbacks.map((feedback) =>
            feedback.id === id ? { ...feedback, status, response } : feedback,
          ),
        })),
      addPromotion: (promotion) =>
        set((state) => ({ promotions: [promotion, ...state.promotions] })),
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),
      updateSettings: (nextSettings) => set({ settings: nextSettings }),
    }),
    {
      name: "doceria-dona-lu-store",
      partialize: (state) => ({
        user: state.user,
        sidebarOpen: state.sidebarOpen,
        products: state.products,
        votes: state.votes,
        feedbacks: state.feedbacks,
        promotions: state.promotions,
        settings: state.settings,
      }),
    },
  ),
);
