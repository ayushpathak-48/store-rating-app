import { AverageStatsCard } from "@/components/cards/average-stats-card";
import API from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { ChartColumn, ChartSpline } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const OwnerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [storeRatings, setStoreRatings] = useState<Array<any> | null>(null);
  const [storeStats, setStoreStats] = useState({
    total: 0,
    averageRating: 0,
  });
  const [isRatingsLoaded, setIsRatingsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllRatings = async () => {
      const { data: res } = await API.get(`/ratings/${user?.store?.id}`);
      const averageRating =
        res.data?.reduce((acc: number, rating: any) => acc + rating.rating, 0) /
        res.data?.length;

      console.log({ ratings: res.data });

      setStoreStats({
        total: res.data?.length,
        averageRating: averageRating,
      });

      setStoreRatings(res.data);
      setIsRatingsLoaded(true);
    };

    if (isAuthenticated) {
      fetchAllRatings();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-2xl font-semibold">Store : {user?.store?.name}</div>
      <div className="py-8 flex items-center flex-wrap gap-6">
        <AverageStatsCard
          label="Total Ratings"
          icon={ChartColumn}
          value={storeStats?.total}
          isLoading={!isRatingsLoaded}
        />
        <AverageStatsCard
          label="Average Ratings"
          icon={ChartSpline}
          value={storeStats?.averageRating}
          isLoading={!isRatingsLoaded}
        />
      </div>
      <DataTable
        columns={columns}
        data={storeRatings || []}
        loading={!isRatingsLoaded}
      />
    </div>
  );
};
