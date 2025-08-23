// src/routes/ProtectedLayout.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return <Outlet />; // Renders nested routes
};

export default ProtectedLayout;
