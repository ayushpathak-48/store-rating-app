import { create } from "zustand";
import API from "@/lib/api";
import type {
  SigninType,
  SignUpSchemaType,
  UpdatePasswordSchemaType,
} from "@/schema/auth.schema";
import { removeLocalStorageItems, setLocalStorageItems } from "@/lib/utils";
import { toast } from "sonner";

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
  getProfile: () => Promise<boolean>;
  updatePassword: (values: UpdatePasswordSchemaType) => Promise<boolean>;
  logout: (device?: "this" | "all") => void;
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
      setLocalStorageItems([
        { key: "token", value: data.accessToken },
        { key: "refreshToken", value: data.refreshToken },
      ]);
      const { data: profileResponse } = await API.get("/auth/profile");
      set({
        user: profileResponse.data,
        token: data.access_token,
        isAuthenticated: true,
      });
      setLocalStorageItems([{ key: "uuid", value: profileResponse.data.id }]);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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

  getProfile: async () => {
    try {
      const { data: response } = await API.get("/auth/profile");
      setLocalStorageItems([{ key: "uuid", value: response.data.id }]);
      if (response?.success) {
        set({
          user: response.data,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  },

  logout: async (device: "this" | "all" = "this") => {
    const loadingToast = toast.loading("Logging out! Please wait...");
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("uuid");
    const logoutEndpoint =
      device === "this" ? "/auth/logout" : "/auth/logout-all";
    const { data: response } = await API.post(logoutEndpoint, {
      userId,
      refreshToken,
    });
    if (response?.success) {
      removeLocalStorageItems(["token", "user", "refreshToken"]);
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully");
      set({
        user: null,
        isAuthenticated: false,
      });
      return true;
    }
    toast.dismiss(loadingToast);
    toast.error("Something went wrong while logging out");
    return false;
  },

  updatePassword: async (values: UpdatePasswordSchemaType) => {
    set({ loading: true });
    const { confirm_password, ...data } = values;
    if (!(data.new_password === confirm_password)) {
      toast.error("New Password and confirm password does not match");
    }
    const loadingToast = toast.loading("Updating user! Please wait...");
    try {
      await API.put(`/auth/password`, data);
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      toast.error(error.response.data.message);
      return false;
    } finally {
      toast.dismiss(loadingToast);
      set({ loading: false });
    }
  },
}));
