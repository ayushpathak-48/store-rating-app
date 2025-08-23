import { create } from "zustand";
import API from "@/lib/api";
import type { SigninType } from "@/schema/auth.schema";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "SYSTEM_ADMIN" | "USER" | "STORE_OWNER";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (values: SigninType) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token"),
  loading: false,

  login: async (values: SigninType) => {
    set({ loading: true });
    try {
      const { email, password } = values;
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });
      console.log({ "login response": data });
      set({ user: data.user, token: data.access_token });
      localStorage.setItem("token", data.access_token);
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));
