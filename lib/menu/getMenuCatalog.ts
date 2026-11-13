import "server-only"
import { randomInt } from "node:crypto"
import { setTimeout } from "node:timers/promises"
import { PLACEHOLDER_PRODUCTS } from "@/lib/menu/placeholderProducts"
import type { IProduct } from "@/types/menu"

// loads the complete public catalog before rendering filters and dishes.
export const getMenuCatalog = async (): Promise<IProduct[]> => {
  await setTimeout(randomInt(200, 901))

  return PLACEHOLDER_PRODUCTS
}
