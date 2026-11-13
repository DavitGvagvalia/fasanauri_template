import type { z } from "zod"
import type { checkoutSchema } from "@/schemas/checkoutSchema"

export type TCheckoutValues = z.infer<typeof checkoutSchema>
