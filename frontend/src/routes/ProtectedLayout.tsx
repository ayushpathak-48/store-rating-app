// src/routes/ProtectedLayout.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/common/navbar";
import { Sidebar } from "@/components/common/sidebar";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <SidebarProvider className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </SidebarProvider>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">{<Outlet />}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
