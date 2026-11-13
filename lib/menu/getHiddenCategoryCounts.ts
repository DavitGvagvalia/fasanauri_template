import type { IHiddenCategoryCounts } from "@/types/menu"

export const getHiddenCategoryCounts = (
  visible: number[],
  total: number
): IHiddenCategoryCounts => {
  if (!visible.length || total <= 0) {
    return { left: 0, right: 0 }
  }

  return {
    left: Math.max(0, Math.min(...visible)),
    right: Math.max(0, total - Math.max(...visible) - 1),
  }
}
