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
  name: z
    .string()
    .nonempty("Name is required")
    .min(20, { message: "Name must be at least 20 characters long" })
    .max(60, { message: "Name can not be more than 60 characters long" }),
  email: z.string().min(1, { message: "Email is required" }).email(),
  address: z.string().nonempty("Address is required"),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password should be minimum 8 characters long" }),
});
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
