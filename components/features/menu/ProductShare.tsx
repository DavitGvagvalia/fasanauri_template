"use client"

import { useRef, useState } from "react"
import { TOOLTIP_DELAY_MS } from "@/constants"
import type { ReactElement } from "react"
import type { KeyboardEvent } from "react"
import { Check, Copy, Share2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import ProductShareLink from "@/components/features/menu/ProductShareLink"
import { getProductShareURL } from "@/lib/menu/getProductShareURL"
import type { IProduct } from "@/types/menu"

interface IProps {
  product: IProduct
}

const ProductShare = ({ product }: IProps): ReactElement => {
  const t = useTranslations("Share")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [url, setURL] = useState("")
  const [copyStatus, setCopyStatus] = useState<"copy" | "copied" | "copyError">("copy")
  const trigger = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  const show = (): void => {
    setURL(getProductShareURL(window.location.origin, locale, product))
    setCopyStatus("copy")
    setOpen(true)
    requestAnimationFrame(() => closeButton.current?.focus())
  }

  const close = (): void => {
    setOpen(false)
    trigger.current?.focus()
  }

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("copyError")
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Escape") {
      event.stopPropagation()
      close()
    }
  }

  const encodedURL = encodeURIComponent(url)
  const title = encodeURIComponent(product.title[locale])
  const links = [
    { key: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}` },
    { key: "twitter", href: `https://twitter.com/intent/tweet?url=${encodedURL}&text=${title}` },
    {
      key: "pinterest",
      href: `https://www.pinterest.com/pin/create/button/?url=${encodedURL}&description=${title}&media=${encodeURIComponent(new URL(product.imageURL, url || "https://example.com").href)}`,
    },
    { key: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}` },
  ] as const

  return (
    <TooltipProvider delay={TOOLTIP_DELAY_MS}>
      <div className="shrink-0 lg:pointer-events-none lg:absolute lg:inset-0 lg:z-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-(--product-image-height)">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  ref={trigger}
                  variant="secondary"
                  size="icon"
                  onClick={show}
                  aria-label={t("open")}
                  aria-expanded={open}
                  aria-controls={open ? `share-${product.id}` : undefined}
                  className="pointer-events-auto absolute right-3 bottom-3 rounded-full"
                />
              }
            >
              <Share2 aria-hidden />
            </TooltipTrigger>
            <TooltipContent>{t("open")}</TooltipContent>
          </Tooltip>
        </div>
        {open && (
          <aside
            id={`share-${product.id}`}
            aria-label={t("open")}
            className="pointer-events-auto mx-4 mb-4 flex flex-wrap justify-center gap-1 rounded-lg border bg-popover p-2 lg:absolute lg:top-0 lg:left-[calc(100%+0.75rem)] lg:m-0 lg:max-h-[80dvh] lg:flex-col lg:flex-nowrap lg:overflow-y-auto"
            onKeyDown={handleKeyDown}
          >
            <Button
              ref={closeButton}
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={close}
              aria-label={t("close")}
            >
              <X aria-hidden />
            </Button>
            {links.map(({ key, href }) => (
              <ProductShareLink
                key={key}
                network={key}
                href={href}
              />
            ))}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    onClick={copy}
                    size="icon"
                    className="size-9"
                    aria-label={t(copyStatus)}
                  />
                }
              >
                {copyStatus === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
              </TooltipTrigger>
              <TooltipContent side="right">{t(copyStatus)}</TooltipContent>
            </Tooltip>
            <p
              role="status"
              className="sr-only"
            >
              {copyStatus !== "copy" ? t(copyStatus) : ""}
            </p>
          </aside>
        )}
      </div>
    </TooltipProvider>
  )
}

export default ProductShare
