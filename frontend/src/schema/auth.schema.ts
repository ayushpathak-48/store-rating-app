import * as z from "zod";

export const SignInSchema = z.object({
  email: z.email().nonempty({ message: "Email is required" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password should be minimum 8 characters long" }),
});
export type SigninType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password should be minimum 8 characters long" }),
});
export type SignupType = z.infer<typeof SignUpSchema>;
