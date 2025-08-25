import { ArrowUpDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { UserStoreTableActions } from "./user-stores-table-actions";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sno.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="line-clamp-1">{row.index + 1}</p>,
    sortingFn: (rowA, rowB) => rowA.index - rowB.index,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <span className={cn("truncate")}>{row?.original?.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <span className={cn("truncate")}>{row?.original?.address}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "averageRating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Average Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center max-w-[150px]">
          {[1, 2, 3, 4, 5].map((ele) => (
            <Star
              key={ele}
              className={cn(
                "stroke-0 size-5 fill-gray-500",
                ele <= row.original?.averageRating && "fill-yellow-500",
              )}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "userRating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Your Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center max-w-[150px]">
          {!row.original.userRating?.rating
            ? "Not rated yet"
            : [1, 2, 3, 4, 5].map((ele) => (
                <Star
                  key={ele}
                  className={cn(
                    "stroke-0 size-5 fill-gray-500",
                    ele <= row.original?.userRating?.rating &&
                      "fill-yellow-500",
                  )}
                />
              ))}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Actions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <UserStoreTableActions store={row?.original} />;
    },
  },
];
