"use client";

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
import { SignInSchema, type SigninType } from "@/schema/auth.schema";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingButton } from "@/components/loading-button";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<SigninType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SigninType) => {
    setIsLoading(true);
    try {
      await login(values);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign in");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none gap-1">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">RateMonks - Login</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7 pb-0" />
      <CardContent className="p-7">
        <Form {...form}>
          <form
            className="space-y-4 gap-2 flex flex-col"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
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
                      placeholder="Enter your email"
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
                        placeholder="Enter password here"
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
            <DottedSeparator className="py-2" />
            <LoadingButton
              className="w-full"
              isLoading={isLoading}
              type="submit"
              size="lg"
            >
              Sign in
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
