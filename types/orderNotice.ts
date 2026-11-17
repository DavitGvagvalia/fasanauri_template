import type { IDemoOrder } from "@/types/order"

export interface INoticeSidebarWidths {
  left: number
  right: number
}

export interface IOrderNoticeCollapse {
  isCollapsed: (order: IDemoOrder) => boolean
  collapseOrder: (order: IDemoOrder) => void
  expandOrder: (order: IDemoOrder) => void
}

export interface IOrderNoticePresentation extends IOrderNoticeCollapse {
  permissionCollapsed: boolean
  collapsePermission: () => void
  expandPermission: () => void
}

export interface IOrderNoticeLayout {
  inline: boolean
  compact: boolean
  width: number
  hidden: boolean
  permissionInline: boolean
  noticeWidth: number
  permissionWidth: number
}
