import { Input } from "@/components/ui/input";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/components/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStoresStore } from "@/store/storesStore";
import { StoreSchema, type StoreSchemaType } from "@/schema/store.schema";
import { useUserStore } from "@/store/userStore";
import { useNavigate, useParams } from "react-router";
import SkeletonWrapper from "@/components/common/SkeletonWrapper";

export const EditStorePage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const isUsersLoaded = useUserStore((state) => state.isUsersLoaded);
  const storeOwners = useUserStore((state) => state.storeOwners);
  const stores = useStoresStore((state) => state.stores);
  const isStoresLoaded = useStoresStore((state) => state.isStoresLoaded);
  const fetchStores = useStoresStore((state) => state.fetchStores);
  const fetchUsers = useUserStore((state) => state.getAllUsers);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateStore = useStoresStore((state) => state.updateStore);
  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      ownerId: "",
      name: "",
      address: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isUsersLoaded) {
      fetchUsers();
    }
    if (!isStoresLoaded) {
      fetchStores();
    }
  }, []);

  useEffect(() => {
    if (isStoresLoaded && isUsersLoaded) {
      const tempStore = stores.find((s) => s.id === storeId);
      if (!tempStore) navigate("/admin/stores", { replace: true });
      form.reset({
        ownerId: tempStore?.ownerId || "",
        name: tempStore?.name || "",
        address: tempStore?.address || "",
        email: tempStore?.email || "",
      });
    }
  }, [isStoresLoaded, isUsersLoaded]);

  const handleSubmit = async (values: StoreSchemaType) => {
    try {
      setIsUpdating(true);
      await updateStore(storeId as string, values);
      navigate("/admin/stores");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full h-max md:w-[487px] mx-auto">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Update Store</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7 mb-2" />
      <CardContent className="p-7">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Owner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SkeletonWrapper
                        isLoading={!isStoresLoaded || !isUsersLoaded}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a suitable faculty for this member" />
                        </SelectTrigger>
                      </SkeletonWrapper>
                    </FormControl>
                    <SelectContent>
                      {storeOwners?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <SkeletonWrapper
                      isLoading={!isStoresLoaded || !isUsersLoaded}
                    >
                      <Input {...field} placeholder="Enter Store Name" />
                    </SkeletonWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Email</FormLabel>
                  <FormControl>
                    <SkeletonWrapper
                      isLoading={!isStoresLoaded || !isUsersLoaded}
                    >
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Store Email"
                      />
                    </SkeletonWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Address</FormLabel>
                  <FormControl>
                    <SkeletonWrapper
                      isLoading={!isStoresLoaded || !isUsersLoaded}
                    >
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Store Address"
                      />
                    </SkeletonWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator className="px-7 mb-2" />
            <LoadingButton
              className="w-full"
              isLoading={isUpdating}
              type="submit"
              size="lg"
            >
              Update
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
