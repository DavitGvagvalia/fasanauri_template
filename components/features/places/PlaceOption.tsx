"use client"

import { Check, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import CtaPattern from "@/components/shared/CtaPattern"
import CardImage from "@/components/shared/CardImage"
import { buttonVariants } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { updateMenuFilters } from "@/lib/menu/updateMenuFilters"
import type { IPlace } from "@/types/place"
import type { ComponentProps, ReactElement } from "react"

interface IProps {
  place: IPlace
  selected: boolean
  query: string
  onSelect: () => void
}

const PlaceOption = ({ place, selected, query, onSelect }: IProps): ReactElement => {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("Places")
  const card = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (selected) {
      // the sheet mounts on each opening, scroll its container without moving the page.
      const container = card.current?.parentElement
      if (container && card.current) {
        container.scrollTop = card.current.offsetTop - container.offsetTop - 16
      }
    }
  }, [selected])
  const params = new URLSearchParams(query)
  params.set("place", place.id)
  params.delete("cursor")
  const navigate: NonNullable<ComponentProps<typeof Link>["onNavigate"]> = (event): void => {
    if (pathname === "/") {
      // the complete catalog is already available, native history updates every branch consumer together.
      event.preventDefault()
      updateMenuFilters({ place: place.id }, "push")
    }
  }

  return (
    <div
      ref={card}
      className={cn(
        "group/card group/button relative overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors hover:border-foreground/40 focus-within:ring-2 focus-within:ring-ring",
        selected && "border-primary bg-primary text-primary-foreground hover:border-primary"
      )}
    >
      <Link
        href={`${pathname === "/about" ? "/about" : "/"}?${params}`}
        onClick={onSelect}
        onNavigate={navigate}
        prefetch={pathname === "/" ? false : undefined}
        aria-current={selected ? "true" : undefined}
        className="block outline-none"
      >
        <div className="relative h-36 overflow-hidden">
          <CardImage
            imageURL={place.imageURL}
            alt={place.title[locale]}
            sizes="(max-width: 639px) calc(115vw - 48px), 470px"
          />
        </div>
        <div className="relative isolate flex h-14 items-center gap-3 overflow-hidden pr-16 pl-4">
          <CtaPattern />
          <span className="text-sm leading-none font-medium">{place.title[locale]}</span>
          {selected && (
            <Check
              className="size-4 shrink-0"
              aria-label={t("current")}
            />
          )}
        </div>
      </Link>
      <a
        href={place.mapsURL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("openMap", { place: place.title[locale] })}
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
            className:
              "absolute right-3 bottom-7 size-9 translate-y-1/2 transition-colors duration-200",
          }),
          selected
            ? "hover:bg-primary-foreground/20 hover:text-primary-foreground focus-visible:bg-primary-foreground/20"
            : "hover:bg-foreground/10 focus-visible:bg-foreground/10"
        )}
      >
        <MapPin aria-hidden />
      </a>
    </div>
  )
}

export default PlaceOption
