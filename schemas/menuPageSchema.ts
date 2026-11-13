import { z } from "zod"
import { ECategory } from "@/constants"
import { productSchema } from "@/schemas/productSchema"

export const menuPageSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  popularProducts: z.array(productSchema),
  categoryCounts: z.partialRecord(z.enum(ECategory), z.number().int().nonnegative()),
  nextCursor: z.number().int().nonnegative().nullable(),
})
