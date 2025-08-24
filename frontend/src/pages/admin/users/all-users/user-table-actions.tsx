import { CustomTooltip } from "@/components/common/custom-tooltip";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useUserStore } from "@/store/userStore";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router";

export const UserTableActions = ({ user }: { user: any }) => {
  const deleteUser = useUserStore((state) => state.deleteUser);

  const [ConfirmDialog, confirm] = useConfirm(
    `Delete ${user.name}`,
    "This user will be removed permanently",
    "destructive",
  );

  const handleDeleteUser = async () => {
    const ok = await confirm();
    if (!ok) return;
    await deleteUser(user.id);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <ConfirmDialog />
      <CustomTooltip content="Edit" side="left">
        <Button variant={"outline"} asChild>
          <Link to={`/admin/users/${user.id}`}>View</Link>
        </Button>
      </CustomTooltip>
      <CustomTooltip content="Edit" side="left">
        <Button variant={"outline"} asChild>
          <Link to={`/admin/users/edit/${user.id}`}>
            <PencilIcon />
          </Link>
        </Button>
      </CustomTooltip>
      <CustomTooltip content="Delete" side="right">
        <Button
          onClick={handleDeleteUser}
          variant={"outline"}
          className="text-red-500 border-red-200 hover:text-red-400"
        >
          <TrashIcon />
        </Button>
      </CustomTooltip>
    </div>
  );
};
