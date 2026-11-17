import { z } from "zod"
import { isCheckoutPhone } from "@/lib/checkout/isCheckoutPhone"
import { orderNoteSchema } from "@/schemas/orderNoteSchema"

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "nameError").max(100, "nameError"),
  phone: z.string().trim().max(30, "phoneError").refine(isCheckoutPhone, "phoneError"),
  address: z.string().trim().min(5, "addressError").max(300, "addressError"),
  note: orderNoteSchema,
})
