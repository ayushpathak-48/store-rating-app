import { AverageStatsCard } from "@/components/cards/average-stats-card";
import { useStatsStore } from "@/store/statsStore";
import { ChartColumn, ChartSpline, TrendingUp } from "lucide-react";
import { useEffect } from "react";

const Dashboard = () => {
  const { stats, isStatsLoaded, fetchStats } = useStatsStore();

  useEffect(() => {
    if (!isStatsLoaded) {
      fetchStats();
    }
  }, [fetchStats]);

  return (
    <div className="py-8 flex items-center flex-wrap gap-6">
      <AverageStatsCard
        label="Total Users"
        icon={ChartColumn}
        value={stats?.totalUsers?.toString()}
        isLoading={!isStatsLoaded}
      />
      <AverageStatsCard
        label="Total Stores"
        icon={TrendingUp}
        value={stats?.totalStores?.toString()}
        isLoading={!isStatsLoaded}
      />
      <AverageStatsCard
        label="Total Ratings"
        icon={ChartSpline}
        value={stats?.totalRatings?.toString()}
        isLoading={!isStatsLoaded}
      />
    </div>
  );
};

export default Dashboard;
