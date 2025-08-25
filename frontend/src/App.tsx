import { Toaster } from "sonner";
import { Routes, Route } from "react-router";
import AuthLayout from "@/routes/AuthLayout";
import { LoginPage } from "@/pages/auth/Login";
import { useAuthStore } from "./store/authStore";
import { SignUpPage } from "@/pages/auth/Signup";
import NotFound from "@/components/not-found-page";
import { AdminLayout } from "./routes/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import OwnerDashboard from "@/pages/owner/Dashboard";
import ProtectedLayout from "@/routes/ProtectedLayout";
import { UserDashboard } from "@/pages/user/Dashboard";
import { SettingsPage } from "@/pages/settings/settings-page";
import { AddUserPage } from "@/pages/admin/users/add/add-user-page";
import { AddNewStore } from "@/pages/admin/stores/add/add-store-page";
import { EditUserPage } from "@/pages/admin/users/edit/edit-user-page";
import { EditStorePage } from "@/pages/admin/stores/edit/edit-store-page";
import { AllusersPage } from "@/pages/admin/users/all-users/all-users-page";
import { AllStoresPage } from "@/pages/admin/stores/all-stores/all-stores-page";
import { UserDetailsPage } from "@/pages/admin/users/user-details/user-details-page";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  const user = useAuthStore((state) => state.user);
  return (
    <ThemeProvider defaultTheme="dark">
      <Routes>
        {/* Public routes  */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>

        {/* Protected routes  */}
        <Route element={<ProtectedLayout />}>
          <Route
            index
            element={
              user?.role === "SYSTEM_ADMIN" ? (
                <AdminDashboard />
              ) : user?.role === "STORE_OWNER" ? (
                <OwnerDashboard />
              ) : (
                <UserDashboard />
              )
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="stores" element={<AllStoresPage />} />
            <Route path="stores/add" element={<AddNewStore />} />
            <Route path="stores/edit/:storeId" element={<EditStorePage />} />
            <Route path="users" element={<AllusersPage />} />
            <Route path="users/add" element={<AddUserPage />} />
            <Route path="users/:userId" element={<UserDetailsPage />} />
            <Route path="users/edit/:userId" element={<EditUserPage />} />
          </Route>

          {/* Store Owner Routes */}
          <Route path="/owner" element={<OwnerDashboard />} />

          {/* Normal Routes */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Not Found route page  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
