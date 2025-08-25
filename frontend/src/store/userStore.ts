import { create } from "zustand";
import API from "@/lib/api";
import { toast } from "sonner";
import type { UserSchemaType } from "@/schema/user.schema";
import type { User } from "./authStore";

interface UserState {
  allUsers: User[];
  users: User[];
  storeOwners: User[];
  systemAdmins: User[];
  loading: boolean;
  isUsersLoaded: boolean;
  getAllUsers: () => Promise<User[]>;
  addUser: (values: UserSchemaType) => Promise<User>;
  updateUser: (id: string, values: UserSchemaType) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
  // logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  allUsers: [],
  users: [],
  storeOwners: [],
  systemAdmins: [],
  loading: false,
  isUsersLoaded: false,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await API.get("/admin/users");
      const { data: users } = response.data;
      const storeOwners = users.filter(
        (user: User) => user.role === "STORE_OWNER",
      );
      const systemAdmins = users.filter(
        (user: User) => user.role === "SYSTEM_ADMIN",
      );
      const normalUsers = users.filter((user: User) => user.role === "USER");

      set({
        storeOwners,
        systemAdmins,
        users: normalUsers,
        allUsers: response.data.data,
      });

      return users;
    } finally {
      set({ loading: false, isUsersLoaded: true });
    }
  },

  addUser: async (values: UserSchemaType) => {
    set({ loading: true });
    const loadingToast = toast.loading("Registering user! Please wait...");
    try {
      const { data: res } = await API.post("/auth/register", values);
      const user = res.data;
      if (user.role == "STORE_OWNER") {
        set((state) => ({
          storeOwners: [user, ...state.storeOwners],
        }));
      }

      if (user.role == "USER") {
        set((state) => ({
          users: [user, ...state.users],
        }));
      }

      set((state) => ({
        allUsers: [user, ...state.allUsers],
      }));

      toast.success("User added successfully");
      return user;
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      toast.dismiss(loadingToast);
      set({ loading: false });
    }
  },

  updateUser: async (id: string, values: UserSchemaType) => {
    set({ loading: true });
    const loadingToast = toast.loading("Updating user! Please wait...");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...dataWithoutPassword } = values;
      const { data: res } = await API.put(
        `/auth/profile/${id}`,
        dataWithoutPassword,
      );
      const user = res.data;
      if (user.role == "STORE_OWNER") {
        set((state) => ({
          storeOwners: state.storeOwners.map((user) =>
            user.id === id ? { ...user, ...res.data } : user,
          ),
        }));
      }

      if (user.role == "USER") {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...res.data } : user,
          ),
        }));
      }

      set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === id ? { ...user, ...res.data } : user,
        ),
        loading: false,
      }));
      toast.success("User updated successfully");
      return user;
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      toast.dismiss(loadingToast);
      set({ loading: false });
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true });
    const loadingToast = toast.loading("Deleting user! Please wait...");
    try {
      const { data: deletedUser } = await API.delete(`/users/${id}`);
      toast.success("User deleted successfully");

      if (deletedUser.data.role == "USER") {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          loading: false,
        }));
      } else if (deletedUser.data.role == "STORE_OWNER") {
        set((state) => ({
          storeOwners: state.storeOwners.filter((user) => user.id !== id),
          loading: false,
        }));
      }
      set((state) => ({
        allUsers: state.allUsers.filter((user) => user.id !== id),
        loading: false,
      }));
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
