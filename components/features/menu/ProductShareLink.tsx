"use client"

import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import SocialIcon from "@/components/shared/SocialIcon"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { TShareNetwork } from "@/types/menuSharing"

interface IProps {
  network: TShareNetwork
  href: string
}

const ProductShareLink = ({ network, href }: IProps): ReactElement => {
  const t = useTranslations("Share")

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(`${network}Tooltip`)}
            className={buttonVariants({ variant: "ghost", size: "icon", className: "size-9" })}
          />
        }
      >
        <SocialIcon network={network} />
      </TooltipTrigger>
      <TooltipContent side="right">{t(`${network}Tooltip`)}</TooltipContent>
    </Tooltip>
  )
}

export default ProductShareLink
