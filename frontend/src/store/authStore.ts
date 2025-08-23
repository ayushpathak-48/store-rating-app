import { create } from "zustand";
import API from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "SYSTEM_ADMIN" | "USER" | "STORE_OWNER";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await API.post("/auth/login", { email, password });
      set({ user: data.user, token: data.token });
      localStorage.setItem("token", data.token);
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));
