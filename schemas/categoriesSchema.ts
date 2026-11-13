import { z } from "zod"
import { ECategory } from "@/constants"

export const categoriesSchema = z.array(
  z.object({
    id: z.enum(ECategory),
    imageURL: z.string().startsWith("/_next/static/media/"),
    title: z.object({ ka: z.string(), en: z.string(), ru: z.string() }),
  })
)
