"use client"

import type { ReactElement } from "react"

import Image from "next/image"
import { Check, X } from "lucide-react"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS } from "@/constants"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const LanguageSwitcher = (): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Common")
  const pathname = usePathname()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)
  const close = (): void => {
    setOpen(false)
  }
  const href = `${pathname}${params.size ? `?${params}` : ""}`

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            aria-label={t("language")}
            className="mr-1 h-5 w-7.5 sm:h-7 sm:w-10.5 shrink-0 overflow-hidden rounded-md border-0 bg-transparent p-0 transition-opacity hover:bg-transparent hover:opacity-85 sm:mr-2"
          />
        }
      >
        <Image
          src={LOCALE_FLAGS[locale]}
          alt=""
          width={42}
          height={28}
          className="h-full w-full object-cover"
          unoptimized
        />
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        className="data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-6 pr-14">
          <SheetTitle>{t("language")}</SheetTitle>
          <SheetDescription>{t("languageDescription")}</SheetDescription>
        </SheetHeader>
        <SheetClose
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("close")}
              className="absolute top-5 right-4"
            />
          }
        >
          <X aria-hidden />
        </SheetClose>
        <nav
          aria-label={t("language")}
          className="space-y-3 px-5 py-2"
        >
          {LOCALES.map((language) => (
            <Link
              key={language}
              href={href}
              locale={language}
              hrefLang={language}
              lang={language}
              replace
              scroll={false}
              onClick={close}
              aria-current={locale === language ? "true" : undefined}
              className={cn(
                buttonVariants({
                  variant: locale === language ? "secondary" : "outline",
                }),
                "h-16 w-full justify-start gap-4 rounded-xl px-4"
              )}
            >
              <Image
                src={LOCALE_FLAGS[language]}
                alt=""
                width={48}
                height={32}
                className="h-8 w-12 rounded-sm object-cover ring-1 ring-border"
                unoptimized
              />
              <span className="flex-1 text-base">{LOCALE_LABELS[language]}</span>
              {locale === language && <Check aria-hidden />}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default LanguageSwitcher
