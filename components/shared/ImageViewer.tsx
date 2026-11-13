"use client"

import { useRef, useState } from "react"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import FullScreenImage from "@/components/shared/FullScreenImage"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { MouseEvent, ReactElement, ReactNode } from "react"

interface IProps {
  imageURL: string
  alt: string
  title: string
  children: ReactNode
  className?: string
}

const ImageViewer = ({ imageURL, alt, title, children, className }: IProps): ReactElement => {
  const t = useTranslations("Common")
  const closeButton = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  const closeOutsideImage = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={t("viewImage", { title })}
            className={cn(
              "group/card cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring",
              className
            )}
          />
        }
      >
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        initialFocus={closeButton}
        // base UI suppresses nested backdrops unless forced, images must also blur an open sheet.
        forceOverlay
        overlayClassName="product-dialog-backdrop z-60"
        onClick={closeOutsideImage}
        className="top-0 left-0 z-70 h-dvh w-full max-w-none translate-x-0 translate-y-0 grid-rows-[minmax(0,1fr)] gap-0 rounded-none bg-transparent p-6 ring-0 sm:max-w-none motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{t("imageViewerDescription")}</DialogDescription>
        <FullScreenImage
          imageURL={imageURL}
          alt={alt}
        />
        <DialogClose
          render={
            <Button
              ref={closeButton}
              variant="secondary"
              size="icon-lg"
              aria-label={t("close")}
              className="absolute top-4 right-4"
            />
          }
        >
          <X aria-hidden />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer
