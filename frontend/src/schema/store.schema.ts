import * as z from "zod";

export const StoreSchema = z.object({
  ownerId: z.string().min(1, { message: "Owner is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});
export type StoreSchemaType = z.infer<typeof StoreSchema>;
