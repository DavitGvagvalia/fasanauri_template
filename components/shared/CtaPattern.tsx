"use client"

import type { ReactElement } from "react"
import { useId } from "react"

import BrandLogo from "@/components/shared/BrandLogo"

const CtaPattern = (): ReactElement => {
  const patternId = useId()

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-current opacity-[0.07]"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        width="100%"
        height="100%"
        className="absolute inset-0 size-full scale-110 transition-transform duration-300 group-hover/button:scale-125 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <defs>
          {/* svg tiling covers every container size and offsets alternate rows into a diamond pattern. */}
          <pattern
            id={patternId}
            width="48"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <g transform="translate(0 2)">
              <BrandLogo className="size-4" />
            </g>
            <g transform="translate(24 22)">
              <BrandLogo className="size-4" />
            </g>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
        />
      </svg>
    </span>
  )
}

export default CtaPattern
