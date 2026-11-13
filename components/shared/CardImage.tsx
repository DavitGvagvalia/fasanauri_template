import Image from "next/image"
import type { ReactElement } from "react"

import placeholderFood from "@/assets/images/placeholder_food.webp"

interface IProps {
  imageURL: string
  alt: string
  sizes: string
  eager?: boolean
}

const CardImage = ({ imageURL, alt, sizes, eager = false }: IProps): ReactElement => {
  // the shared placeholder is also the above fold image, keep its loading policy consistent.
  const loadImmediately = eager || imageURL === placeholderFood.src

  return (
    // transforms a fixed size compositor layer, the bitmap itself never changes its layout or scale mode.
    <div className="pointer-events-none absolute inset-0 transform-[translate3d(0,0,0)_scale(1)] backface-hidden transition-transform duration-400 ease-in-out will-change-transform motion-safe:group-hover/card:transform-[translate3d(0,0,0)_scale(1.15)] motion-reduce:transition-none motion-reduce:will-change-auto">
      <Image
        src={imageURL}
        alt={alt}
        fill
        sizes={sizes}
        loading={loadImmediately ? "eager" : "lazy"}
        draggable={false}
        className="object-cover backface-hidden"
      />
    </div>
  )
}

export default CardImage
