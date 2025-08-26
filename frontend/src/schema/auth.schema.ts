import * as z from "zod";

export const SignInSchema = z.object({
  email: z.email().nonempty({ error: "Email is required" }),
  password: z
    .string()
    .nonempty({ error: "Password is required" })
    .min(8, { error: "Password should be minimum 8 characters long" }),
});
export type SigninType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(20, { error: "Name must be at least 20 characters long" })
    .max(60, { error: "Name can not be exceed 60 characters" }),
  email: z.string().min(1, { error: "Email is required" }).email(),
  address: z.string().nonempty("Address is required"),
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Password can not exceed 16 characters" })
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
      "Password must contain at least one uppercase letter and one special character",
    ),
});
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export const UpdatePasswordSchema = z
  .object({
    old_password: z
      .string()
      .nonempty({ error: "Old Password is required" })
      .min(8, { error: "Old Password should be minimum 8 characters long" })
      .max(16, { error: "Old Password cannot exceed 16 characters" })
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        "Password must contain at least one uppercase letter and one special character",
      ),

    new_password: z
      .string()
      .nonempty({ error: "New Password is required" })
      .min(8, { error: "New Password should be minimum 8 characters long" })
      .max(16, { error: "New Password cannot exceed 16 characters" })
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        "Password must contain at least one uppercase letter and one special character",
      ),

    confirm_password: z
      .string()
      .nonempty({ error: "Confirm Password is required" })
      .min(8, {
        error: "Confirm Password should be minimum 8 characters long",
      })
      .max(16, {
        error: "Confirm Password cannot exceed 16 characters",
      })
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        "Password must contain at least one uppercase letter and one special character",
      ),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    error: "New Password and Confirm Password must match",
    path: ["confirm_password"],
  })
  .refine((data) => data.old_password !== data.new_password, {
    error: "New Password cannot be the same as Old Password",
    path: ["new_password"],
  });

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;
