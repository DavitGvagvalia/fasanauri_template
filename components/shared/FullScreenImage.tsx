"use client"

import { useState } from "react"
import Image from "next/image"
import type { ReactElement, SyntheticEvent } from "react"

interface IProps {
  imageURL: string
  alt: string
}

const FullScreenImage = ({ imageURL, alt }: IProps): ReactElement => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    if (!naturalWidth || !naturalHeight) {
      return
    }
    setDimensions((previous) =>
      previous?.width === naturalWidth && previous.height === naturalHeight
        ? previous
        : { width: naturalWidth, height: naturalHeight }
    )
  }

  return (
    <div className="pointer-events-none relative flex h-full min-h-0 w-full items-center justify-center">
      <Image
        src={imageURL}
        alt={alt}
        fill={!dimensions}
        width={dimensions?.width}
        height={dimensions?.height}
        sizes="100vw"
        loading="eager"
        draggable={false}
        onLoad={handleLoad}
        style={
          dimensions
            ? {
                width: `min(90vw, calc(86dvh * ${dimensions.width / dimensions.height}))`,
              }
            : undefined
        }
        // intrinsic dimensions keep rounded corners on the bitmap, not its letterboxed area.
        className="pointer-events-auto h-auto max-h-full max-w-full rounded-lg object-contain"
      />
    </div>
  )
}

export default FullScreenImage
