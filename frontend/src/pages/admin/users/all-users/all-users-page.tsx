import { columns } from "./columns";
import { useEffect } from "react";
import { DataTable } from "./data-table";
import { useUserStore } from "@/store/userStore";

export const AllusersPage = () => {
  const { allUsers, getAllUsers, isUsersLoaded } = useUserStore();

  useEffect(() => {
    if (!isUsersLoaded) {
      getAllUsers();
    }
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={allUsers} loading={!isUsersLoaded} />
    </div>
  );
};
