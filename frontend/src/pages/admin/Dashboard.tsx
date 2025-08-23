import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();
  console.log({ user });
  return <div>Admin Dashboard</div>;
};

export default Dashboard;
