import { create } from "zustand";
import API from "@/lib/api";
import type { SignupType } from "@/schema/auth.schema";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "SYSTEM_ADMIN" | "USER" | "STORE_OWNER";
}

interface UserState {
  users: User[];
  storeOwners: User[];
  systemAdmins: User[];
  loading: boolean;
  getAllUsers: () => Promise<User[]>;
  addUser: (values: SignupType) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  // logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  storeOwners: [],
  systemAdmins: [],
  loading: false,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await API.get("/users");
      const { data: users } = response.data;

      const storeOwners = users.filter(
        (user: User) => user.role === "STORE_OWNER",
      );
      const systemAdmins = users.filter(
        (user: User) => user.role === "SYSTEM_ADMIN",
      );
      const normalUsers = users.filter((user: User) => user.role === "USER");

      set({ storeOwners, systemAdmins, users: normalUsers });
      return users;
    } finally {
      set({ loading: false });
    }
  },

  addUser: async (values: SignupType) => {
    set({ loading: true });
    try {
      const response = await API.post("/auth/signup", values);
      const user = response.data.user;
      set((state) => ({ users: [...state.users, user], loading: false }));
      return user;
    } finally {
      set({ loading: false });
    }
  },
  deleteUser: async (id: string) => {
    set({ loading: true });
    try {
      await API.delete(`/users/${id}`);
    } finally {
      set({ loading: false });
    }
  },
}));
