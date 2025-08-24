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
import { UserSchema, type UserSchemaType } from "@/schema/user.schema";
import { useUserStore } from "@/store/userStore";
import { useNavigate, useParams } from "react-router";
import SkeletonWrapper from "@/components/common/SkeletonWrapper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const isUsersLoaded = useUserStore((state) => state.isUsersLoaded);
  const allUsers = useUserStore((state) => state.allUsers);
  const getAllUsers = useUserStore((state) => state.getAllUsers);
  const updateUser = useUserStore((state) => state.updateUser);
  const form = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      role: "USER",
      password: "12345678", //setting this default to remove from update user functionality
    },
  });

  useEffect(() => {
    if (!isUsersLoaded) {
      getAllUsers();
    }
  }, []);

  useEffect(() => {
    if (isUsersLoaded) {
      const tempUser = allUsers.find((s) => s.id === userId);
      if (!tempUser) navigate("/admin/stores", { replace: true });
      form.reset({
        name: tempUser?.name || "",
        address: tempUser?.address || "",
        email: tempUser?.email || "",
        role: tempUser?.role == "STORE_OWNER" ? "STORE_OWNER" : "USER",
        password: "12345678",
      });
    }
  }, [isUsersLoaded]);

  const handleSubmit = async (values: UserSchemaType) => {
    try {
      setIsUpdating(true);
      await updateUser(userId as string, values);
      navigate("/admin/users");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full h-max md:w-[487px] mx-auto gap-2">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Update User</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <SkeletonWrapper isLoading={!isUsersLoaded}>
                      <Input {...field} placeholder="Enter User Name" />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <SkeletonWrapper isLoading={!isUsersLoaded}>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter User Email"
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <SkeletonWrapper isLoading={!isUsersLoaded}>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter User Address"
                      />
                    </SkeletonWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>User Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="w-full">
                        <FormControl>
                          <RadioGroupItem value="USER" className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "flex items-center gap-2 w-full border rounded p-3 cursor-pointer justify-center",
                            form.getValues("role") == "USER" &&
                              "border-primary",
                          )}
                        >
                          User
                        </FormLabel>
                      </FormItem>
                      <FormItem className="w-full">
                        <FormControl>
                          <RadioGroupItem
                            value="STORE_OWNER"
                            className="hidden"
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "flex items-center gap-2 w-full border rounded p-3 cursor-pointer justify-center",
                            form.getValues("role") == "STORE_OWNER" &&
                              "border-primary",
                          )}
                        >
                          Store Owner
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
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
              Update User
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
