import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/common/navbar";
import { Sidebar } from "@/components/common/sidebar";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const ProtectedLayout = () => {
  const getProfile = useAuthStore((state) => state.getProfile);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!user && isAuthenticated) {
      getProfile();
    }
  }, [getProfile, user, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  if (!user)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );

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
