"use client"

import type { ReactElement, RefObject } from "react"
import { useEffect, useId, useState } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "next-intl"

import { NOTIFICATION_BROWSER_GUIDES } from "@/constants"
import { getNotificationBrowser } from "@/lib/cart/getNotificationBrowser"

interface IProps {
  dialogRef: RefObject<HTMLDivElement | null>
}

const NotificationPermissionArrow = ({ dialogRef }: IProps): ReactElement | null => {
  const t = useTranslations("PendingOrders")
  const marker = useId()
  const [geometry, setGeometry] = useState({ width: 0, height: 0, startX: 0, startY: 0 })
  useEffect(() => {
    const measure = (): void => {
      const bounds = dialogRef.current?.getBoundingClientRect()
      if (bounds) {
        setGeometry({
          width: window.innerWidth,
          height: window.innerHeight,
          startX: Math.max(20, bounds.left - 12),
          startY: Math.max(60, bounds.top + 36),
        })
      }
    }
    const frame = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    if (dialogRef.current) {
      observer.observe(dialogRef.current)
    }
    window.addEventListener("resize", measure)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [dialogRef])

  if (!geometry.width) {
    return null
  }
  const browser = getNotificationBrowser(navigator.userAgent)
  const guide = NOTIFICATION_BROWSER_GUIDES[browser]
  const targetX = browser === "safari" ? 24 : Math.min(160, geometry.width * 0.14)
  const pointer = `M ${geometry.startX} ${geometry.startY} Q ${Math.max(12, Math.min(geometry.startX, targetX) - 40)} ${Math.max(32, geometry.startY * 0.3)} ${targetX} 8`

  // browser controls sit outside the document, so the pointer ends at the viewport edge.
  return createPortal(
    <div
      aria-hidden="true"
      data-slot="notification-permission-arrow"
      className="pointer-events-none fixed inset-0 z-80 text-foreground"
    >
      <svg
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        className="absolute inset-0 size-full"
        fill="none"
      >
        <defs>
          <marker
            id={marker}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path
              d="M 0 0 L 6 3 L 0 6 Z"
              fill="currentColor"
            />
          </marker>
        </defs>
        <path
          d={pointer}
          stroke="var(--popover)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d={pointer}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd={`url(#${marker})`}
        />
      </svg>
      {geometry.startY > 160 && (
        <p
          style={{
            left: Math.min(targetX + 16, Math.max(12, geometry.width - 292)),
            width: Math.min(280, geometry.width - 24),
          }}
          className="absolute top-5 rounded-lg border bg-popover p-3 text-xs leading-5 text-popover-foreground shadow-lg"
        >
          {t(guide.first)}
        </p>
      )}
    </div>,
    document.body
  )
}

export default NotificationPermissionArrow
