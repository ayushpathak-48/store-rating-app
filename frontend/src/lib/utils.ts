import type { Store } from "@/store/storesStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setLocalStorageItems = (
  items: { key: string; value: string }[],
) => {
  items.forEach(({ key, value }) => {
    localStorage.setItem(key, value);
  });
};

export const removeLocalStorageItems = (keys: string[]) => {
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const formatRole = (role: string | undefined) => {
  if (!role) return "";
  return role.split("_").join(" ");
};

export const formatStoresForUser = (stores: Store[]) => {
  const userId = localStorage.getItem("uuid");
  return stores.map((store: Store) => {
    const averageRating =
      store?.ratings &&
      store?.ratings?.length > 0 &&
      store?.ratings?.reduce(
        (acc: number, rating: any) => acc + rating.rating,
        0,
      ) / store?.ratings?.length;
    const userRating = store?.ratings?.find((t: any) => t.userId === userId);
    return {
      ...store,
      userRating,
      averageRating,
    };
  });
};
