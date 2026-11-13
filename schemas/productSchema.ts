import { z } from "zod"
import {
  ECategory,
  EPlace,
  PLACEHOLDER_PRICE_MINOR,
  PLACE_IDS,
  EMPTY_PRODUCT_DESCRIPTION,
} from "@/constants"

export const productSchema = z.preprocess(
  (input) => {
    // migrate persisted cart records from the previous image field name.
    if (typeof input === "object" && input !== null && "image" in input && !("imageURL" in input)) {
      return { ...input, imageURL: input.image }
    }

    return input
  },
  z.object({
    id: z.string().min(1),
    categoryId: z
      .enum(ECategory)
      .refine((category) => category !== ECategory.All && category !== ECategory.Popular),
    title: z.object({ ka: z.string(), en: z.string(), ru: z.string() }),
    description: z
      .object({ ka: z.string(), en: z.string(), ru: z.string() })
      .default(EMPTY_PRODUCT_DESCRIPTION),
    kind: z.enum(["food", "beverage"]),
    imageURL: z.string().startsWith("/_next/static/media/"),
    isPlaceholder: z.literal(true),
    // older saved carts did not include prices, migrate them to the fixed demo price.
    priceMinor: z.number().int().nonnegative().default(PLACEHOLDER_PRICE_MINOR),
    placeIds: z.array(z.enum(EPlace)).default(PLACE_IDS),
    isPopular: z.boolean().default(false),
  })
)
