/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MobileSidebar } from "@/components/common/mobile-sidebar";
import { APP_TITLE, defaultMap, pathnameMap } from "@/lib/constants";
import { UserButton } from "@/components/common/user-button";
import { Link, useLocation } from "react-router";
import ThemeToggle from "./theme-toggler-button";

export const Navbar = () => {
  const location = useLocation();
  const pathnameParts = location.pathname.split("/");
  const pathnameKey = pathnameParts[2] as keyof typeof pathnameMap;
  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <Link
        to={"/"}
        className="hidden text-xl max-lg:flex items-center justify-center"
      >
        {APP_TITLE}
      </Link>
      <div className="lg:flex flex-col hidden">
        <div className="text-2xl font-semibold">{title}</div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
        <MobileSidebar />
      </div>
    </nav>
  );
};
