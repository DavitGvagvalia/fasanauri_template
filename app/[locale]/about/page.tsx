import { Suspense } from "react"
import type { ReactElement } from "react"

import AboutPlace from "@/components/features/places/AboutPlace"
import AboutPlaceLoading from "@/components/features/places/AboutPlaceLoading"

const AboutPage = ({ searchParams }: PageProps<"/[locale]/about">): ReactElement => {
  return (
    <Suspense fallback={<AboutPlaceLoading />}>
      <AboutPlace searchParams={searchParams} />
    </Suspense>
  )
}

export default AboutPage
