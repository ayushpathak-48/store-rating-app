import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

function SkeletonWrapper({
  children,
  isLoading,
  className = "w-full",
}: {
  children: ReactNode;
  isLoading: boolean;
  className?: string;
}) {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(className)}>
      <div className="opacity-0 pointer-events-none">{children}</div>
    </Skeleton>
  );
}

export default SkeletonWrapper;
