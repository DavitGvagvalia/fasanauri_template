"use client"

import type { ReactElement, ReactNode } from "react"
import { useEffect, useLayoutEffect, useRef } from "react"
import type { LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ORDER_NOTICE_COLLAPSED_SIZE_PX, ORDER_NOTICE_HEIGHT_PX } from "@/constants"
import { cn } from "@/lib/utils"

interface IProps {
  children: ReactNode
  collapsed: boolean
  onExpand: () => void
  icon: LucideIcon
  label: string
  width: number
  height?: string | number
  attention?: boolean
  active?: boolean
  noticeKey?: string
}

const CollapsibleNoticeFrame = ({
  children,
  collapsed,
  onExpand,
  icon: Icon,
  label,
  width,
  height = ORDER_NOTICE_HEIGHT_PX,
  attention = false,
  active = true,
  noticeKey,
}: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const frame = useRef<HTMLDivElement>(null)
  const collapsedButton = useRef<HTMLButtonElement>(null)
  const expandedContent = useRef<HTMLDivElement>(null)
  const previous = useRef(collapsed)
  useLayoutEffect(() => {
    if (!collapsed && frame.current) {
      frame.current.style.setProperty("--notice-expanded-width", `${width}px`)
      frame.current.style.setProperty(
        "--notice-expanded-height",
        typeof height === "number" ? `${height}px` : height
      )
      frame.current.style.setProperty(
        "--notice-collapse-x",
        String(ORDER_NOTICE_COLLAPSED_SIZE_PX / width)
      )
      frame.current.style.setProperty(
        "--notice-collapse-y",
        String(
          ORDER_NOTICE_COLLAPSED_SIZE_PX /
            (typeof height === "number" ? height : Math.max(44, window.innerHeight * 0.1 - 12))
        )
      )
    }
  }, [collapsed, width, height])
  useEffect(() => {
    if (previous.current !== collapsed) {
      if (collapsed) {
        collapsedButton.current?.focus()
      } else {
        expandedContent.current?.querySelector<HTMLButtonElement>("button")?.focus()
      }
      previous.current = collapsed
    }
  }, [collapsed])

  return (
    <div
      ref={frame}
      data-notice-key={noticeKey}
      style={{
        width: collapsed ? ORDER_NOTICE_COLLAPSED_SIZE_PX : width,
        height: collapsed ? ORDER_NOTICE_COLLAPSED_SIZE_PX : height,
      }}
      className={cn(
        "group/notice notification-slide-in relative shrink-0 self-end overflow-hidden rounded-lg shadow-lg transition-[width,height,background-color] duration-300 ease-[var(--drawer-motion-easing)] motion-reduce:transition-none",
        collapsed ? "bg-image-overlay" : "bg-popover"
      )}
    >
      <div
        data-slot="notice-content"
        ref={expandedContent}
        inert={collapsed || !active}
        aria-hidden={collapsed || !active || undefined}
        style={{
          width: `var(--notice-expanded-width, ${width}px)`,
          height: `var(--notice-expanded-height, ${typeof height === "number" ? `${height}px` : height})`,
          transform: collapsed
            ? "scale(var(--notice-collapse-x, 0.15), var(--notice-collapse-y, 0.39))"
            : "scale(1, 1)",
        }}
        className={cn(
          "absolute right-0 bottom-0 origin-bottom-right transition-[transform,opacity] duration-300 ease-[var(--drawer-motion-easing)] motion-reduce:transition-none",
          collapsed ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        {children}
      </div>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              ref={collapsedButton}
              data-slot="notice-expand"
              tabIndex={collapsed && active ? 0 : -1}
              aria-hidden={!collapsed || !active || undefined}
              onClick={onExpand}
              aria-label={t("expandNotice", { label })}
              className={cn(
                "absolute right-0 bottom-0 size-11 rounded-lg border-0 bg-image-overlay bg-clip-border text-image-foreground transition-opacity duration-150 hover:bg-image-overlay focus-visible:ring-inset motion-reduce:transition-none motion-reduce:delay-0",
                collapsed ? "opacity-100 delay-150" : "pointer-events-none opacity-0 delay-0"
              )}
            />
          }
        >
          <Icon
            aria-hidden="true"
            className={cn(attention && "confirmation-bell")}
          />
        </TooltipTrigger>
        <TooltipContent>{t("expandNotice", { label })}</TooltipContent>
      </Tooltip>
    </div>
  )
}

export default CollapsibleNoticeFrame
