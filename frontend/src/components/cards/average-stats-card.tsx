/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartBarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SkeletonWrapper from "../common/SkeletonWrapper";

export const AverageStatsCard = ({
  icon = ChartBarIcon,
  label,
  value = "",
  cardClass = "",
  badgeClass = "",
  badgeText = "",
  isLoading = true,
}: {
  icon?: any;
  label: string;
  value?: ReactNode | string | undefined | null;
  cardClass?: string;
  badgeClass?: string;
  badgeText?: string;
  isLoading?: boolean;
}) => {
  const Icon = icon;
  return (
    <SkeletonWrapper
      isLoading={isLoading}
      className="min-w-[250px] flex-1 grow relative"
    >
      <Card
        className={cn("min-w-[250px] flex-1 grow relative py-0", cardClass)}
      >
        {badgeText != "" && (
          <Badge
            variant={"outline"}
            className={cn("bg-white absolute -top-2 left-1", badgeClass)}
          >
            {badgeText}
          </Badge>
        )}
        <CardContent className="flex flex-col items-start gap-4 p-3 px-5">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold">{value}</div>
            <div className="bg-gray-100 rounded-full p-3 dark:bg-gray-800">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {label}
            </h3>
          </div>
        </CardContent>
      </Card>
    </SkeletonWrapper>
  );
};
