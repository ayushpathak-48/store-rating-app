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
import { AddStoreSchema, type AddStoreSchemaType } from "@/schema/store.schema";
import { useUserStore } from "@/store/userStore";
import { Loader } from "lucide-react";

export const AddNewStore = () => {
  const systemAdmins = useUserStore((state) => state.systemAdmins);
  const storeOwners = useUserStore((state) => state.storeOwners);
  const fetchUsers = useUserStore((state) => state.getAllUsers);

  useEffect(() => {
    if (!systemAdmins.length) {
      fetchUsers();
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const addStore = useStoresStore((state) => state.addStore);
  const form = useForm<AddStoreSchemaType>({
    resolver: zodResolver(AddStoreSchema),
    defaultValues: {
      ownerId: "",
      name: "",
      address: "",
      email: "",
    },
  });

  const handleSubmit = async (values: AddStoreSchemaType) => {
    setIsLoading(true);
    try {
      await addStore(values);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  if (!systemAdmins) return <Loader className="animate-spin" />;

  return (
    <Card className="w-full h-max md:w-[487px] mx-auto">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Add Store</CardTitle>
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a suitable faculty for this member" />
                      </SelectTrigger>
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
                    <Input {...field} placeholder="Enter Store Name" />
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
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter Store Email"
                    />
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
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter Store Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator className="px-7 mb-2" />
            <LoadingButton
              className="w-full"
              isLoading={isLoading}
              type="submit"
              size="lg"
            >
              Add Store
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
