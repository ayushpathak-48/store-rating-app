"use client";

import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Link, useLocation } from "react-router";

export const Navigation = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.icon;
        const isSystemAdmin = user?.role == "SYSTEM_ADMIN";
        const isStoreOwner = user?.role == "STORE_OWNER";
        const isUser = user?.role == "USER";

        if (
          !item.requiredRoles ||
          (isSystemAdmin && item.requiredRoles?.includes("SYSTEM_ADMIN")) ||
          (isStoreOwner && item.requiredRoles?.includes("STORE_OWNER")) ||
          (isUser && item.requiredRoles?.includes("USER"))
        )
          return (
            <Link key={item.href} to={item.href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                  isActive &&
                    "bg-white dark:bg-gray-700 shadow-sm hover:opacity-100 text-primary",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 text-neutral-500",
                    isActive && "text-primary",
                  )}
                />
                {item.label}
              </div>
            </Link>
          );
      })}
    </ul>
  );
};
