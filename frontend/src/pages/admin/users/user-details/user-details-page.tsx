import SkeletonWrapper from "@/components/common/SkeletonWrapper";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import API from "@/lib/api";
import { cn, formatRole } from "@/lib/utils";
import type { User } from "@/store/authStore";
import { Pencil, Star } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";

export const UserDetailsPage = () => {
  const { userId } = useParams();
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<
    (User & { store: any; ratings: any }) | null
  >(null);
  useEffect(() => {
    if (!user || user.id !== userId) {
      fetchSingleUserDetails();
    }
  }, [userId]);

  const fetchSingleUserDetails = async () => {
    try {
      const { data: userData } = await API.get(`/admin/users/${userId}`);
      if (userData?.data?.store) {
        userData.data.store.averageRating =
          userData.data.store.ratings.reduce(
            (sum: number, item: any) => sum + item.rating,
            0,
          ) / userData.data.store.ratings.length || 0;
      }
      if (userData.success) {
        setUser(userData.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 flex-wrap">
      <SkeletonWrapper isLoading={userLoading}>
        <Card className="gap-3 flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-medium">User Details</CardTitle>
          </CardHeader>
          <DottedSeparator className="" />
          <CardContent>
            <CardItem label="Name:" value={user?.name} />
            <CardItem label="Email:" value={user?.email} />
            <CardItem label="Address:" value={user?.address} />
            <CardItem label="Role:" value={formatRole(user?.role)} />
          </CardContent>
          <CardFooter>
            <Button variant={"outline"} asChild>
              <Link to={`/admin/users/edit/${user?.id}`}>
                <Pencil />
                Edit Profile
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </SkeletonWrapper>
      {user?.store && (
        <Card className="gap-3 flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Store Details</CardTitle>
          </CardHeader>
          <DottedSeparator className="" />
          <CardContent>
            <CardItem label="Store Name:" value={user?.store?.name} />
            <CardItem label="Store Email:" value={user?.store?.email} />
            <CardItem label="Store Address:" value={user?.store?.address} />
            <CardItem
              label="Total Store Ratings:"
              value={user?.store?.ratings?.length}
            />
            <CardItem
              label="Average Store Ratings:"
              value={[1, 2, 3, 4, 5].map((ele) => (
                <Star
                  className={cn(
                    "stroke-0 size-5 fill-gray-500",
                    ele <= user?.store?.averageRating && "fill-yellow-500",
                  )}
                />
              ))}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CardItem = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode | string | undefined;
}) => {
  return (
    <div className="px-4 py-2 border-b flex items-center gap-3 ">
      <span className="text-base text-gray-500">{label}</span>
      <span className="flex items-center gap-1">{value}</span>
    </div>
  );
};
