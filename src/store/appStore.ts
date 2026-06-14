import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SocialPlatform } from "@/types";

type AppState = {
  sidebarOpen: boolean;
  favoriteProductIds: string[];
  searchHistory: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleFavorite: (productId: string) => void;
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;
  trackSocialClick: (platform: SocialPlatform | "share") => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      favoriteProductIds: [],
      searchHistory: [],
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleFavorite: (productId) =>
        set((state) => {
          const exists = state.favoriteProductIds.includes(productId);

          return {
            favoriteProductIds: exists
              ? state.favoriteProductIds.filter((id) => id !== productId)
              : [...state.favoriteProductIds, productId],
          };
        }),
      addSearchTerm: (term) =>
        set((state) => {
          const normalized = term.trim().toLowerCase();
          if (!normalized) return state;

          return {
            searchHistory: [
              normalized,
              ...state.searchHistory.filter((item) => item !== normalized),
            ].slice(0, 6),
          };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      trackSocialClick: () => undefined,
    }),
    {
      name: "doceria-dona-lu-ui-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        favoriteProductIds: state.favoriteProductIds,
        searchHistory: state.searchHistory,
      }),
    },
  ),
);
