import { DEMO_MAPS_URL } from "@/constants/site"
import { EPlace } from "@/constants/placeIds"
import type { IPlace } from "@/types/place"

export const PLACES: IPlace[] = [
  {
    id: EPlace.Dolidze,
    title: { ka: "დოლიძე", en: "Dolidze", ru: "Долидзе" },
    imageURL: "/images/placeholder_place_image.webp",
    mapsURL: DEMO_MAPS_URL,
  },
  {
    id: EPlace.Leonidze,
    title: { ka: "ლეონიძე", en: "Leonidze", ru: "Леонидзе" },
    imageURL: "/images/placeholder_place_image.webp",
    mapsURL: DEMO_MAPS_URL,
  },
  {
    id: EPlace.Kazbegi,
    title: { ka: "ყაზბეგი", en: "Kazbegi", ru: "Казбеги" },
    imageURL: "/images/placeholder_place_image.webp",
    mapsURL: DEMO_MAPS_URL,
  },
  {
    id: EPlace.Baratashvili,
    title: {
      ka: "ბარათაშვილი",
      en: "Baratashvili",
      ru: "Бараташвили",
    },
    imageURL: "/images/placeholder_place_image.webp",
    mapsURL: DEMO_MAPS_URL,
  },
  {
    id: EPlace.Gorgasali,
    title: { ka: "გორგასალი", en: "Gorgasali", ru: "Горгасали" },
    imageURL: "/images/placeholder_place_image.webp",
    mapsURL: DEMO_MAPS_URL,
  },
]
