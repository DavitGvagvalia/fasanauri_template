import "server-only"

import { randomInt } from "node:crypto"
import { setTimeout } from "node:timers/promises"

import { PLACEHOLDER_CATEGORIES } from "@/lib/menu/placeholderCategories"
import type { ICategory } from "@/types/menu"

export const getCategories = async (): Promise<ICategory[]> => {
  // matches the product fixture boundary until a live catalog provider is selected.
  await setTimeout(randomInt(200, 901))

  return PLACEHOLDER_CATEGORIES
}
