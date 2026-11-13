import { z } from "zod"
import { MAX_CART_QUANTITY } from "@/constants"
import { productSchema } from "@/schemas/productSchema"

export const cartStorageSchema = z
  .array(
    z
      .object({
        product: productSchema,
        serving: z.enum(["bottle", "glass"]).nullable(),
        quantity: z.number().int().min(1).max(MAX_CART_QUANTITY),
      })
      .refine((line) =>
        line.product.kind === "beverage" ? line.serving !== null : line.serving === null
      )
  )
  .max(100)
