import { columns } from "./columns";
import { useEffect } from "react";
import { DataTable } from "./data-table";
import { useStoresStore } from "@/store/storesStore";

export const AllStoresPage = () => {
  const { stores, fetchStores, isStoresLoaded } = useStoresStore();

  useEffect(() => {
    if (!isStoresLoaded) {
      fetchStores();
    }
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={stores} loading={!isStoresLoaded} />
    </div>
  );
};
