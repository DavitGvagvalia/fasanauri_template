import { z } from "zod"

import { MAX_ORDER_NOTE_LENGTH } from "@/constants"

export const orderNoteSchema = z.string().trim().max(MAX_ORDER_NOTE_LENGTH, "noteError").optional()
