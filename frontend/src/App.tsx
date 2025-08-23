import { Routes, Route } from "react-router";
import UserDashboard from "@/pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import { LoginPage } from "./pages/auth/Login";
import ProtectedLayout from "./routes/ProtectedLayout";
import { Toaster } from "sonner";
import AuthLayout from "./routes/AuthLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/owner" element={<OwnerDashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
