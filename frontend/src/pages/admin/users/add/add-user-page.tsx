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
import { useState } from "react";
import { LoadingButton } from "@/components/loading-button";
import { UserSchema, type UserSchemaType } from "@/schema/user.schema";
import { useUserStore } from "@/store/userStore";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export const AddUserPage = () => {
  const navigate = useNavigate();
  const addUser = useUserStore((state) => state.addUser);

  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      role: "USER",
      password: "",
    },
  });

  const handleSubmit = async (values: UserSchemaType) => {
    setIsLoading(true);
    try {
      const addedUser = await addUser(values);
      if (!addedUser) return;
      navigate("/admin/users");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-max md:w-[487px] mx-auto gap-1">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Add User</CardTitle>
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

            <FormField
              name={"password"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={passwordType}
                        placeholder="Enter User password"
                      />
                      {passwordType == "text" ? (
                        <Eye
                          onClick={() => setPasswordType("password")}
                          className="absolute top-4 right-3 cursor-pointer size-5 text-gray-600"
                        />
                      ) : (
                        <EyeOff
                          onClick={() => setPasswordType("text")}
                          className="absolute top-4 right-3 cursor-pointer size-5 text-gray-600"
                        />
                      )}
                    </div>
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
              isLoading={isLoading}
              type="submit"
              size="lg"
            >
              Add User
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
