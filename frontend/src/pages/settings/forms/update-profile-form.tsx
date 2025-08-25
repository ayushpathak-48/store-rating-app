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
import { useAuthStore } from "@/store/authStore";

export const UpdateProfileForm = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useAuthStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const userId = localStorage.getItem("uuid");
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
    if (user) {
      form.reset({
        name: user?.name || "",
        address: user?.address || "",
        email: user?.email || "",
        role: user?.role == "STORE_OWNER" ? "STORE_OWNER" : "USER",
        password: "12345678",
      });
    }
  }, [user]);

  const handleSubmit = async (values: UserSchemaType) => {
    try {
      setIsUpdating(true);
      await updateUser(userId as string, values);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full h-max gap-2">
      <CardHeader>
        <CardTitle className="text-2xl">Update Profile</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7 my-2" />
      <CardContent className="">
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
                    <Input {...field} placeholder="Enter User Name" />
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
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter User Email"
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter User Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DottedSeparator className=" mb-2" />
            <LoadingButton
              className="w-max"
              isLoading={isUpdating}
              disabled={!form.formState.isDirty}
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
