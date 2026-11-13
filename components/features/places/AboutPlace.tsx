import type { ReactElement } from "react"
import { Suspense } from "react"
import { connection } from "next/server"

import AboutPlaceContent from "@/components/features/places/AboutPlaceContent"
import AboutPlaceLoading from "@/components/features/places/AboutPlaceLoading"
import { DEFAULT_PLACE, PLACES } from "@/constants"

interface IProps {
  searchParams: PageProps<"/[locale]/about">["searchParams"]
}

const AboutPlace = async ({ searchParams }: IProps): Promise<ReactElement> => {
  await connection()
  const params = await searchParams
  const place =
    PLACES.find((item) => item.id === params.place) ??
    PLACES.find((item) => item.id === DEFAULT_PLACE) ??
    PLACES[0]

  return (
    // a branch change resets the gallery boundary instead of retaining the previous branch during loading.
    <Suspense
      key={place.id}
      fallback={<AboutPlaceLoading />}
    >
      <AboutPlaceContent place={place} />
    </Suspense>
  )
}

export default AboutPlace
