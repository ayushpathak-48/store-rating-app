import { Button } from "@/components/ui/button";
import { UpdatePasswordForm } from "./forms/update-password-form";
import { UpdateProfileForm } from "./forms/update-profile-form";
import { useAuthStore } from "@/store/authStore";

export const SettingsPage = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="flex flex-col gap-5">
      <UpdateProfileForm />
      <UpdatePasswordForm />
      <div className="flex flex-row items-center justify-between rounded-lg border border-destructive/50 p-3 shadow-sm">
        <div className="space-y-0.5">
          <div className="font-semibold">Logout (This Device)</div>
          {/* <div>Logout from this device.</div> */}
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between rounded-lg border border-destructive/50 p-3 shadow-sm">
        <div className="space-y-0.5">
          <div className="font-semibold">Logout (All Devices)</div>
          {/* <div>Logout from this device.</div> */}
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={() => logout("all")}>
            Logout All Devices
          </Button>
        </div>
      </div>
    </div>
  );
};
