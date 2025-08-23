import { create } from "zustand";
import API from "@/lib/api";
import { toast } from "sonner";

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: string;
}

interface StoresState {
  stores: Store[];
  selectedStore: Store | null;
  loading: boolean;
  error: string | null;
  fetchStores: () => Promise<void>;
  addStore: (store: Omit<Store, "id" | "createdAt">) => Promise<void>;
  updateStore: (id: string, updatedData: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  setSelectedStore: (store: Store) => void;
}

export const useStoresStore = create<StoresState>((set) => ({
  stores: [],
  selectedStore: null,
  loading: false,
  error: null,

  // Fetch all stores
  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const { data: res } = await API.get("/stores");
      if (!res.success) {
        toast.error(res.message || "Failed to get all stores");
        set({
          error: res?.message || "Failed to get all stores",
          loading: false,
        });
        return;
      }
      set({ stores: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch stores",
        loading: false,
      });
    }
  },

  // Add a store
  addStore: async (storeData) => {
    set({ loading: true, error: null });
    try {
      const { data: res } = await API.post("/stores/create", storeData);
      if (!res.success) {
        toast.error(res.message || "Failed to add store");
        set({
          error: res?.message || "Failed to add store",
          loading: false,
        });
        return null;
      }
      set((state) => ({
        stores: [...state.stores, res.data],
        loading: false,
      }));
      return res.data;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to add store",
        loading: false,
      });
    }
  },

  // Update a store
  updateStore: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const { data: res } = await API.put(`/stores/${id}`, updatedData);
      if (!res.success) {
        toast.error(res.message || "Failed to update store");
        set({
          error: res?.message || "Failed to update store",
          loading: false,
        });
        return;
      }

      set((state) => ({
        stores: state.stores.map((store) =>
          store.id === id ? { ...store, ...res.data } : store,
        ),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update store",
        loading: false,
      });
    }
  },

  // Delete a store
  deleteStore: async (id) => {
    const loadingToast = toast.loading(
      "Please wait while deleting the store...",
    );
    set({ loading: true, error: null });
    try {
      const { data: res } = await API.delete(`/stores/${id}`);
      toast.dismiss(loadingToast);
      if (!res.success) {
        toast.error(res.message || "Failed to delete store");
        set({
          error: res?.message || "Failed to delete store",
          loading: false,
        });
        return;
      }
      toast.success("Store deleted successfully");
      set((state) => ({
        stores: state.stores.filter((store) => store.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      toast.dismiss(loadingToast);
      set({
        error: err.response?.data?.message || "Failed to delete store",
        loading: false,
      });
    }
  },

  // Set selected store
  setSelectedStore: (store) => set({ selectedStore: store }),
}));
