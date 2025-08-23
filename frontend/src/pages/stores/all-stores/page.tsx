import { columns } from "./columns";
import React, { useEffect } from "react";
import { DataTable } from "./data-table";
import { useStoresStore } from "@/store/storesStore";

export const AllStoresPage = () => {
  const { stores, fetchStores } = useStoresStore();

  useEffect(() => {
    fetchStores();
  }, []);

  const data = React.useMemo(() => stores, [stores]);
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
