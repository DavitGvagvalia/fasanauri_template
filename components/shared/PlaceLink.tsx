"use client"

import type { ReactElement, ReactNode } from "react"

import { useSelectedPlace } from "@/hooks/useSelectedPlace"
import { Link } from "@/i18n/navigation"

interface IProps {
  href: string
  className?: string
  children: ReactNode
}

const PlaceLink = ({ href, className, children }: IProps): ReactElement => {
  const place = useSelectedPlace()

  return (
    <Link
      href={{ pathname: href, query: { place: place.id } }}
      className={className}
    >
      {children}
    </Link>
  )
}

export default PlaceLink
