import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import { NotAuthorizedPage } from "@/components/not-authorized-page";

export const AdminLayout = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user?.role !== "SYSTEM_ADMIN") return <NotAuthorizedPage />;

  return <Outlet />;
};
