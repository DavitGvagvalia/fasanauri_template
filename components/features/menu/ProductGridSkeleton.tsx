import type { ReactElement } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PRODUCT_CARD_BODY_CLASS_NAME,
  PRODUCT_GRID_CLASS_NAME,
  PRODUCT_IMAGE_CLASS_NAME,
} from "@/constants"

const ProductGridSkeleton = (): ReactElement => {
  return (
    <div
      aria-hidden
      className={`${PRODUCT_GRID_CLASS_NAME} product-skeleton mt-5`}
    >
      {[0, 1, 2, 3].map((index) => (
        <div
          key={`product-skeleton-${index}`}
          className="min-w-0 overflow-hidden rounded-xl border"
        >
          <div className={PRODUCT_IMAGE_CLASS_NAME}>
            <Skeleton className="absolute inset-0 rounded-none" />
          </div>
          <div className={PRODUCT_CARD_BODY_CLASS_NAME}>
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="mt-auto flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGridSkeleton
