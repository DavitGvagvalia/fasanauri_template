import type { ReactElement } from "react"

import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface IProps {
  onCollapse: () => void
  className?: string
}

const NoticeCollapseButton = ({ onCollapse, className }: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("collapseNotice")}
            onClick={onCollapse}
            className={cn("absolute top-2 right-2 size-6 rounded-sm [&_svg]:size-3.5", className)}
          />
        }
      >
        <ChevronDown aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{t("collapseNotice")}</TooltipContent>
    </Tooltip>
  )
}

export default NoticeCollapseButton
