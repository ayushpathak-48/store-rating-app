import { columns } from "./columns";
import { useEffect } from "react";
import { DataTable } from "./data-table";
import { useStoresStore } from "@/store/storesStore";

export const AllStoresPage = () => {
  const { stores, fetchStores, loading } = useStoresStore();

  useEffect(() => {
    if (!stores.length) {
      fetchStores();
    }
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={stores} loading={loading} />
    </div>
  );
};
