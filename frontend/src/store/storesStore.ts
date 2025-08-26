import { create } from "zustand";
import API from "@/lib/api";
import { toast } from "sonner";
import type { StoreSchemaType } from "@/schema/store.schema";
import { formatStoresForUser } from "@/lib/utils";

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: string;
  ratings?: any[];
  userRating?: any;
}

interface StoresState {
  stores: Store[];
  selectedStore: Store | null;
  isStoresLoaded: boolean;
  fetchStores: (includeRatings?: boolean) => Promise<void>;
  addStore: (store: Omit<Store, "id" | "createdAt">) => Promise<void>;
  updateStore: (id: string, updatedData: StoreSchemaType) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  updateRatings: (storeId: string, rating: number) => Promise<boolean>;
}

export const useStoresStore = create<StoresState>((set, get) => ({
  stores: [],
  selectedStore: null,
  isStoresLoaded: false,

  // Fetch all stores
  fetchStores: async (includeRatings = false) => {
    try {
      const { data: res } = await API.get(
        `/stores${includeRatings ? `?includeRatings=true` : ""}`,
      );
      const formattedStores = formatStoresForUser(res.data);
      set({ stores: formattedStores });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to get all stores");
    } finally {
      set({ isStoresLoaded: true });
    }
  },

  // Add a store
  addStore: async (storeData) => {
    try {
      const { data: res } = await API.post("/stores/create", storeData);
      set((state) => ({
        stores: [...state.stores, res.data],
        loading: false,
      }));
      toast.success("Store created successfully");
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add store");
      throw err;
    }
  },

  // Update a store
  updateStore: async (id: string, updatedData: StoreSchemaType) => {
    try {
      const { data: res } = await API.put(`/stores/${id}`, updatedData);
      set((state) => ({
        stores: state.stores.map((store) =>
          store.id === id ? { ...store, ...res.data } : store,
        ),
        loading: false,
      }));
      toast.success("Store updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update store");
    }
  },

  // Delete a store
  deleteStore: async (id) => {
    const loadingToast = toast.loading(
      "Please wait while deleting the store...",
    );
    try {
      await API.delete(`/stores/${id}`);
      toast.success("Store deleted successfully");
      set((state) => ({
        stores: state.stores.filter((store) => store.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete store");
    } finally {
      toast.dismiss(loadingToast);
    }
  },

  // Add or Update rating
  updateRatings: async (storeId: string, rating: number) => {
    const loadingToast = toast.loading("Please wait while updating ratings...");
    try {
      const { data: res } = await API.post(`/ratings`, { storeId, rating });
      const updatedStores = get()?.stores.map((store) => {
        if (store.id === storeId) {
          return {
            ...store,
            ratings: store?.ratings?.length
              ? store?.ratings?.map((rating: any) =>
                  rating.id == res.data.id ? res.data : rating,
                )
              : [],
            userRating: res.data.userRating,
          };
        }
        return store;
      });

      // Format the stores before setting
      const formattedStores = formatStoresForUser(updatedStores);
      set({ stores: formattedStores });
      toast.success("Ratings updated successfully");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update ratings");
      return false;
    } finally {
      toast.dismiss(loadingToast);
    }
  },
}));
