"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Navigation } from "@/components/common/navigation";
import { APP_TITLE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router";
import { logoutUser } from "@/lib/utils";

export const Sidebar = () => {
  return (
    <aside className="h-full p-4 w-full flex flex-col justify-between">
      <div>
        <Link to={"/"} className="text-3xl flex items-center justify-center">
          {APP_TITLE}
        </Link>
        <DottedSeparator className="my-4" />
        <Navigation />
      </div>
      <div className="flex flex-col">
        <DottedSeparator className="my-4" />
        <Button
          onClick={logoutUser}
          variant={"outline"}
          className="w-full mt-auto"
        >
          Logout <LogOut />
        </Button>
      </div>
    </aside>
  );
};
