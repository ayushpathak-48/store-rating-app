import { columns } from "./columns";
import { useEffect } from "react";
import { DataTable } from "./data-table";
import { useStoresStore } from "@/store/storesStore";

export const UserDashboard = () => {
  const { stores, fetchStores, isStoresLoaded } = useStoresStore();

  useEffect(() => {
    if (!isStoresLoaded) {
      fetchStores(true);
    }
  }, []);

  useEffect(() => {
    console.log({ stores });
  }, [stores]);

  return (
    <DataTable columns={columns} data={stores} loading={!isStoresLoaded} />
  );
};
