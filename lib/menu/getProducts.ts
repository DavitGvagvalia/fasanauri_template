import "server-only"

import { setTimeout } from "node:timers/promises"
import { randomInt } from "node:crypto"

import { PLACEHOLDER_PRODUCTS } from "@/lib/menu/placeholderProducts"
import { queryPlaceholderProducts } from "@/lib/menu/queryPlaceholderProducts"
import type { IMenuFilters, IMenuPage } from "@/types/menu"

export const getProducts = async (filters: IMenuFilters): Promise<IMenuPage> => {
  // fetches placeholder data, with simulated API latency before filtering.
  await setTimeout(randomInt(200, 901))

  return queryPlaceholderProducts(PLACEHOLDER_PRODUCTS, filters)
}
