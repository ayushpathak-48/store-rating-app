import { ResponsiveModal } from "@/components/common/responsive-modal";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStoresStore } from "@/store/storesStore";
import { Star } from "lucide-react";
import { useState } from "react";

export const UserStoreTableActions = ({ store }: { store: any }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(store?.userRating?.rating || 0);
  const updateRatings = useStoresStore((state) => state.updateRatings);

  const handleCancel = () => {
    setOpen(false);
    setRating(store?.userRating?.rating || 0);
  };
  const handleConfirm = async () => {
    setLoading(true);
    const updatedRating = await updateRatings(store.id, rating);
    if (updatedRating) handleCancel();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Button variant={"outline"} onClick={() => setOpen(true)}>
        {!store?.userRating ? "Rate store" : "Update Rating"}
      </Button>

      <ResponsiveModal open={open} onOpenChange={handleCancel}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent>
            <CardHeader className="p-0">
              <CardTitle>
                Rate store : <span className="font-medium">{store.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-2 py-5">
              {[1, 2, 3, 4, 5].map((ele) => (
                <Star
                  key={ele}
                  onClick={() => setRating(ele)}
                  className={cn(
                    "stroke-0 size-10 cursor-pointer fill-gray-500",
                    ele <= rating && "fill-yellow-500",
                  )}
                />
              ))}
            </CardContent>
            <div className="pt-4 w-full flex flex-col lg:!flex-row gap-2 items-center justify-end">
              <Button
                onClick={handleCancel}
                variant={"outline"}
                className="w-full lg:w-max"
              >
                Cancel
              </Button>
              <LoadingButton
                disabled={rating == 0}
                onClick={handleConfirm}
                isLoading={loading}
                className="w-full lg:w-max"
              >
                Submit
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    </div>
  );
};
