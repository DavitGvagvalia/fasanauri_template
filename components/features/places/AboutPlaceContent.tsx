import type { ReactElement } from "react"

import { getPlaceGallery } from "@/lib/places/getPlaceGallery"
import PlaceContactDetails from "@/components/features/places/PlaceContactDetails"
import PlaceGallery from "@/components/features/places/PlaceGallery"
import PlaceOpeningHours from "@/components/features/places/PlaceOpeningHours"
import type { IPlace } from "@/types/place"

interface IProps {
  place: IPlace
}

const AboutPlaceContent = async ({ place }: IProps): Promise<ReactElement> => {
  const images = await getPlaceGallery(place)

  return (
    <main id="main-content">
      <PlaceGallery
        place={place}
        images={images}
      />
      <div className="site-container grid gap-12 py-12 md:grid-cols-2 md:gap-16 md:py-20">
        <PlaceContactDetails place={place} />
        <PlaceOpeningHours />
      </div>
    </main>
  )
}

export default AboutPlaceContent
