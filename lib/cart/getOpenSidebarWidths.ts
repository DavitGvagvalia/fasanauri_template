import type { INoticeSidebarWidths } from "@/types/orderNotice"

export const getOpenSidebarWidths = (): INoticeSidebarWidths => {
  const widths: INoticeSidebarWidths = { left: 0, right: 0 }
  const sheets = document.querySelectorAll<HTMLElement>('[data-slot="sheet-content"][data-open]')
  for (const sheet of sheets) {
    const side = sheet.dataset.side
    if (side === "left" || side === "right") {
      // reserves the final footprint before the opening transform finishes.
      widths[side] = Math.max(widths[side], sheet.offsetWidth)
    }
  }

  return widths
}
