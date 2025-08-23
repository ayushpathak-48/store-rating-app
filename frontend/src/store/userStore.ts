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
  loading: boolean;
  getAllUsers: () => Promise<User[]>;
  addUser: (values: SignupType) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  // logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await API.get("/users");
      const { data: users } = response.data;
      set({ users });
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
