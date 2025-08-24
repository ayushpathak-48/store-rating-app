import { create } from "zustand";
import API from "@/lib/api";
import type { SigninType, SignUpSchemaType } from "@/schema/auth.schema";
import { setLocalStorageItems } from "@/lib/utils";

export type UserRoles = "SYSTEM_ADMIN" | "USER" | "STORE_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  address: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (values: SigninType) => Promise<boolean>;
  signup: (values: SignUpSchemaType) => Promise<boolean>;
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
      const { data: profileResponse } = await API.get("/auth/profile");
      set({
        user: profileResponse.data,
        token: data.access_token,
        isAuthenticated: true,
      });
      setLocalStorageItems([
        { key: "user", value: JSON.stringify(profileResponse.data) },
      ]);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (values: SignUpSchemaType) => {
    set({ loading: true });
    try {
      await API.post("/auth/register", values);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  },

  // logout: () => {
  //   set({ user: null, token: null });
  //   localStorage.removeItem("token");
  // },
}));
