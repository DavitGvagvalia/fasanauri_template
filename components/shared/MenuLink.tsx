"use client"

import { useLocale } from "next-intl"
import { useSelectedPlace } from "@/hooks/useSelectedPlace"
import { Link } from "@/i18n/navigation"
import type { ReactElement, ReactNode } from "react"

interface IProps {
  children: ReactNode
  className?: string
}

const MenuLink = ({ children, className }: IProps): ReactElement => {
  const place = useSelectedPlace()
  const locale = useLocale()

  return (
    <Link
      href={{ pathname: "/", query: { place: place.id } }}
      className={className}
    >
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2">{children}</span>
        <span className="truncate text-xs font-normal tracking-normal text-muted-foreground sm:hidden">
          {place.title[locale]}
        </span>
      </span>
    </Link>
  )
}

export default MenuLink
