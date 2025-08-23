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

export const logoutUser = () => {
  removeLocalStorageItems(["token", "user"]);
  window.location.href = "/auth/login";
};
