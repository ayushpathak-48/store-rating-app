import API from "@/lib/api";
import { create } from "zustand";

interface Stats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

interface StatsState {
  stats: Stats | null;
  isStatsLoaded: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  stats: null,
  isStatsLoaded: false,
  error: null,

  fetchStats: async () => {
    set({ error: null });
    try {
      const { data } = await API.get("/admin/stats");
      set({ stats: data?.data, isStatsLoaded: true });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch stats",
        isStatsLoaded: true,
      });
    }
  },
}));
