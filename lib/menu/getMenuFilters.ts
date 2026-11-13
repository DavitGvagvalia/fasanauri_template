import { DEFAULT_PLACE, PLACE_IDS } from "@/constants"
import { getMenuCategory } from "@/lib/menu/getMenuCategory"
import type { IMenuFilters } from "@/types/menu"

// normalizes untrusted URL filters so server rendering and browser filtering agree.
export const getMenuFilters = (params: Pick<URLSearchParams, "get">): IMenuFilters => {
  const requestedCursor = Number(params.get("cursor") ?? 0)

  return {
    category: getMenuCategory(params.get("category")),
    place: PLACE_IDS.find((place) => place === params.get("place")) ?? DEFAULT_PLACE,
    search: (params.get("search") ?? "").slice(0, 100),
    cursor:
      Number.isSafeInteger(requestedCursor) && requestedCursor >= 0
        ? Math.min(requestedCursor, 10000)
        : 0,
  }
}
