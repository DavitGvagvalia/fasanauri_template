import type { EPlace } from "@/constants/placeIds"
import type { TLocalizedTitle } from "@/types/menu"

export interface IPlace {
  id: EPlace
  title: TLocalizedTitle
  imageURL: string
  mapsURL: string
}

export interface IPlaceContact {
  address: TLocalizedTitle
  phones: string[]
  email: string
}

export interface IPlaceGalleryImage {
  id: string
  imageURL: string
}
