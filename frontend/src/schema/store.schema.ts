import * as z from "zod";

export const StoreSchema = z.object({
  ownerId: z.string().min(1, { error: "Owner is required" }),
  name: z.string().min(1, { error: "Name is required" }),
  email: z.string().min(1, { error: "Email is required" }),
  address: z.string().min(1, { error: "Address is required" }),
});
export type StoreSchemaType = z.infer<typeof StoreSchema>;
