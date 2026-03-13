import { z } from "zod";

export const ProductFormSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    price: z
      .number({ message: "Price must be a number" })
      .positive("Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    image: z.string().url("Image must be a valid URL"),
    inStock: z.boolean(),
    stockCount: z
      .number({
        required_error: "Stock count is required",
        invalid_type_error: "Must be a number",
      })
      .int("Must be a whole number")
      .min(0, "Cannot be negative"),
  })
  .refine((data) => !data.inStock || data.stockCount >= 1, {
    message: "Stock count must be at least 1 when product is in stock",
    path: ["stockCount"],
  });

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
export type ProductFormData = z.infer<typeof ProductFormSchema>;
