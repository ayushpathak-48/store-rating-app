import * as z from "zod";

export const AddStoreSchema = z.object({
  ownerId: z.string().min(1, { message: "Owner is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});
export type AddStoreSchemaType = z.infer<typeof AddStoreSchema>;

export const EditStoreSchema = z.object({
  storeId: z.string(),
  ownerId: z.string().min(1, { message: "Owner is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});
export type EditStoreSchemaType = z.infer<typeof EditStoreSchema>;
