import { Routes, Route } from "react-router";
import UserDashboard from "@/pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import { LoginPage } from "./pages/auth/Login";
import ProtectedLayout from "./routes/ProtectedLayout";
import { Toaster } from "sonner";
import AuthLayout from "./routes/AuthLayout";
import { AllusersPage } from "./pages/admin/users/all-users/all-users-page";
import { AddUserPage } from "./pages/admin/users/add/add-user-page";
import { useAuthStore } from "./store/authStore";
import { AllStoresPage } from "./pages/admin/stores/all-stores/all-stores-page";
import { AddNewStore } from "./pages/admin/stores/add/add-store-page";
import { EditStorePage } from "./pages/admin/stores/edit/edit-store-page";
import { EditUserPage } from "./pages/admin/users/edit/edit-user-page";
import { UserDetailsPage } from "./pages/admin/users/user-details/user-details-page";
import { SignUpPage } from "./pages/auth/Signup";

function App() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>
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
          <Route path="/admin">
            <Route path="stores" element={<AllStoresPage />} />
            <Route path="stores/add" element={<AddNewStore />} />
            <Route path="stores/edit/:storeId" element={<EditStorePage />} />
            <Route path="users" element={<AllusersPage />} />
            <Route path="users/add" element={<AddUserPage />} />
            <Route path="users/:userId" element={<UserDetailsPage />} />
            <Route path="users/edit/:userId" element={<EditUserPage />} />
          </Route>
          <Route path="/owner" element={<OwnerDashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
