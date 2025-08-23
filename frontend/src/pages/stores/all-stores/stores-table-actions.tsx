import { CustomTooltip } from "@/components/common/custom-tooltip";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useStoresStore } from "@/store/storesStore";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router";

export const StoreTableActions = ({ store }: { store: any }) => {
  const deleteStore = useStoresStore((state) => state.deleteStore);

  const [ConfirmDialog, confirm] = useConfirm(
    `Delete ${store.name}`,
    "This store will be removed permanently",
    "destructive",
  );

  const handleDeleteStore = async () => {
    const ok = await confirm();
    if (!ok) return;
    await deleteStore(store.id);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <ConfirmDialog />
      <CustomTooltip content="Edit" side="left">
        <Button variant={"outline"} asChild>
          <Link to={`/admin/stores/edit/${store.id}`}>
            <PencilIcon />
          </Link>
        </Button>
      </CustomTooltip>
      <CustomTooltip content="Delete" side="right">
        <Button
          onClick={handleDeleteStore}
          variant={"outline"}
          className="text-red-500 border-red-200 hover:text-red-400"
        >
          <TrashIcon />
        </Button>
      </CustomTooltip>
    </div>
  );
};
