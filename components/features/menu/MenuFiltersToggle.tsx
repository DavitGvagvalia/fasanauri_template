"use client"

import { ChevronUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ReactElement } from "react"

interface IProps {
  open: boolean
}

const MenuFiltersToggle = ({ open }: IProps): ReactElement => {
  const t = useTranslations("Menu")
  const label = t(open ? "collapseFilters" : "expandFilters")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={label}
                  className={cn(
                    "absolute right-4 z-10 transition-[bottom,background-color] duration-300 ease-out motion-reduce:transition-none sm:right-8 xl:right-12",
                    open ? "bottom-5" : "bottom-2"
                  )}
                />
              }
            />
          }
        >
          <ChevronUp
            aria-hidden
            className={cn(
              "transition-transform duration-300 ease-out motion-reduce:transition-none",
              !open && "rotate-180"
            )}
          />
        </TooltipTrigger>
        <TooltipContent align="end">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default MenuFiltersToggle
