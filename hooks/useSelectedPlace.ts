"use client"

import { useSearchParams } from "next/navigation"
import { DEFAULT_PLACE, PLACES } from "@/constants"
import type { IPlace } from "@/types/place"

export const useSelectedPlace = (): IPlace => {
  const params = useSearchParams()
  const selected = PLACES.find((place) => place.id === params.get("place"))

  return selected ?? PLACES.find((place) => place.id === DEFAULT_PLACE) ?? PLACES[0]
}
