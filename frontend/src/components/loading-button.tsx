import { type ReactNode } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

type LoadingButtonprops = {
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  variant?: "default" | "destructive" | "outline" | "secondary";
};
export const LoadingButton = ({
  isLoading = false,
  disabled = false,
  loadingText = "Please wait...",
  children,
  ...props
}: LoadingButtonprops & React.ComponentProps<"button">) => {
  return (
    <Button {...props} disabled={disabled || isLoading}>
      {isLoading ? (
        <>
          <Loader className="mr-2 size-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
