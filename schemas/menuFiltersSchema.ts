import { z } from "zod"
import { DEFAULT_PLACE, ECategory, EPlace } from "@/constants"

export const menuFiltersSchema = z.object({
  category: z.enum(ECategory).default(ECategory.All),
  place: z.enum(EPlace).default(DEFAULT_PLACE),
  search: z.string().max(100).default(""),
  cursor: z.coerce.number().int().nonnegative().max(10000).default(0),
})
