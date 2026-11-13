import "server-only"
import { randomInt } from "node:crypto"
import { setTimeout } from "node:timers/promises"
import type { IPlace, IPlaceGalleryImage } from "@/types/place"

// loads branch gallery records through the server data boundary.
export const getPlaceGallery = async (place: IPlace): Promise<IPlaceGalleryImage[]> => {
  await setTimeout(randomInt(200, 901))

  return Array.from({ length: 5 }, (_, index) => ({
    id: `${place.id}-${index + 1}`,
    imageURL: place.imageURL,
  }))
}
