"use client"

import { TOOLTIP_DELAY_MS } from "@/constants"
import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import SocialIcon from "@/components/shared/SocialIcon"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { FACEBOOK_URL } from "@/constants"

const FooterFacebookLink = (): ReactElement => {
  const t = useTranslations("Footer")

  return (
    <TooltipProvider delay={TOOLTIP_DELAY_MS}>
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("facebook")}
              className="inline-flex size-10 items-center justify-center rounded-md transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 motion-reduce:transition-none"
            />
          }
        >
          <SocialIcon network="facebook" />
        </TooltipTrigger>
        <TooltipContent>{t("facebook")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default FooterFacebookLink
