import { HomeIcon } from "lucide-react";

export const APP_TITLE = "RateMonks";

export const pathnameMap = {
  feedbacks: {
    title: "Feedbacks",
    description: "View all feedback list here submitted by students",
  },
};

export const defaultMap = {
  title: "Home",
  description: "",
};

export const routes = [
  // Common routes
  {
    label: "Dashboard",
    href: "/",
    icon: HomeIcon,
    activeIcon: HomeIcon,
  },

  // Admin routes
  {
    label: "Stores",
    href: "/admin/stores",
    icon: HomeIcon,
    activeIcon: HomeIcon,
    requiredRoles: ["SYSTEM_ADMIN"],
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: HomeIcon,
    activeIcon: HomeIcon,
    requiredRoles: ["SYSTEM_ADMIN"],
  },

  // Store Owner routes
];
