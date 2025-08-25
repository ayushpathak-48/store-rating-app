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
import {
  UpdatePasswordSchema,
  type UpdatePasswordSchemaType,
} from "@/schema/auth.schema";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff } from "lucide-react";

const formFields = [
  {
    key: "old_password",
    label: "Old Password",
    placeholder: "Enter old password",
  },
  {
    key: "new_password",
    label: "New Password",
    placeholder: "Enter New password",
  },
  {
    key: "confirm_password",
    label: "Confirm Password",
    placeholder: "Enter text here",
  },
] as const;

export const UpdatePasswordForm = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordType, setPasswordType] = useState({
    old_password: "password",
    new_password: "password",
    confirm_password: "password",
  });
  const updatePassword = useAuthStore((state) => state.updatePassword);
  const form = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleSubmit = async (values: UpdatePasswordSchemaType) => {
    try {
      setIsUpdating(true);
      await updatePassword(values);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full h-max gap-2">
      <CardHeader>
        <CardTitle className="text-2xl">Update Password</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7 my-2" />
      <CardContent className="">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {formFields.map(({ key, label, placeholder }) => (
              <FormField
                name={key}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={passwordType[key]}
                          placeholder={placeholder}
                        />
                        {passwordType[key] == "text" ? (
                          <Eye
                            onClick={() =>
                              setPasswordType({
                                ...passwordType,
                                [key]: "password",
                              })
                            }
                            className="absolute top-4 right-3 cursor-pointer size-5 text-gray-600"
                          />
                        ) : (
                          <EyeOff
                            onClick={() =>
                              setPasswordType({
                                ...passwordType,
                                [key]: "text",
                              })
                            }
                            className="absolute top-4 right-3 cursor-pointer size-5 text-gray-600"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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
