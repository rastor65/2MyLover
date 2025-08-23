import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),

  // <- IMPORTANTES: coerce para que NUNCA salgan unknown
  price: z.coerce.number().nonnegative(),
  compareAt: z.coerce.number().positive().optional(),

  status: z.enum(["draft", "published", "archived"]),
  stock: z.coerce.number().int().nonnegative(),

  // <- IMPORTANTES: requeridos con default([]) para que NO sean opcionales
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),

  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
