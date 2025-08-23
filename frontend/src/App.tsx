import { Routes, Route } from "react-router";
import UserDashboard from "@/pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import { LoginPage } from "./pages/auth/Login";
import ProtectedLayout from "./routes/ProtectedLayout";
import { Toaster } from "sonner";
import AuthLayout from "./routes/AuthLayout";
import { AllusersPage } from "./pages/admin/users/Alluser";
import { AddNewUser } from "./pages/admin/users/AddNewUser";
import { useAuthStore } from "./store/authStore";
import { AllStoresPage } from "./pages/stores/all-stores/page";
import { AddNewStore } from "./pages/stores/AddNewStore";

function App() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
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
            <Route path="users" element={<AllusersPage />} />
            <Route path="users/add" element={<AddNewUser />} />
          </Route>
          <Route path="/owner" element={<OwnerDashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
