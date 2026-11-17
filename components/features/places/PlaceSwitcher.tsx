"use client"

import { MapPin, X } from "lucide-react"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import PlaceOption from "@/components/features/places/PlaceOption"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PLACES } from "@/constants"
import { useSelectedPlace } from "@/hooks/useSelectedPlace"
import type { ReactElement } from "react"

const PlaceSwitcher = (): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Places")
  const common = useTranslations("Common")
  const params = useSearchParams()
  const place = useSelectedPlace()
  const [open, setOpen] = useState(false)
  const close = (): void => {
    setOpen(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger
        render={
          <Button
            variant="outline"
            aria-label={`${t("choose")}: ${place.title[locale]}`}
            className="h-10 w-10 min-w-10 shrink-0 gap-2 px-1.5 text-base sm:w-auto sm:px-3"
          />
        }
      >
        <MapPin
          className="size-5 shrink-0"
          aria-hidden
        />
        <span className="hidden truncate sm:inline">{place.title[locale]}</span>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="notice-side-sheet data-[side=left]:w-full data-[side=left]:sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-6 pr-14">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <SheetClose
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={common("close")}
              className="absolute top-5 right-4"
            />
          }
        >
          <X aria-hidden />
        </SheetClose>
        <nav
          aria-label={t("title")}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5"
        >
          {PLACES.map((item) => (
            <PlaceOption
              key={item.id}
              place={item}
              selected={item.id === place.id}
              query={params.toString()}
              onSelect={close}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default PlaceSwitcher
