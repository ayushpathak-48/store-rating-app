import { create } from "zustand";
import API from "@/lib/api";
import type { SigninType } from "@/schema/auth.schema";
import { setLocalStorageItems } from "@/lib/utils";

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
  login: (values: SigninType) => Promise<User>;
  // logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
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
      setLocalStorageItems([{ key: "token", value: data.access_token }]);
      const { data: userData } = await API.get("/auth/profile");
      set({ user: userData.data, token: data.access_token });
      setLocalStorageItems([
        { key: "user", value: JSON.stringify(userData.data) },
      ]);
      return userData.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // logout: () => {
  //   set({ user: null, token: null });
  //   localStorage.removeItem("token");
  // },
}));
