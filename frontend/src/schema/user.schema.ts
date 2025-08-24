import * as z from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(20, {
      message: "Name must be greater than or equal to 20 characters long",
    })
    .max(60, {
      message: "Name must be less than or equal to 60 characters long",
    }),
  email: z.string().min(1, { message: "Email is required" }).email(),
  address: z.string().nonempty("Address is required"),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password should be minimum 8 characters long" }),
  role: z.enum(["STORE_OWNER", "USER"]),
});
export type UserSchemaType = z.infer<typeof UserSchema>;
