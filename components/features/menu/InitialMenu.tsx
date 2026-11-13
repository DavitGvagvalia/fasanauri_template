import type { ReactElement } from "react"
import { connection } from "next/server"

import MenuBrowser from "@/components/features/menu/MenuBrowser"
import { getCategories } from "@/lib/menu/getCategories"
import { getMenuCatalog } from "@/lib/menu/getMenuCatalog"

const InitialMenu = async (): Promise<ReactElement> => {
  // fixture latency uses randomness, so it must run only after a real request arrives.
  await connection()
  // resolves request specific filters below Suspense so the shared app shell stays prefetchable.
  const [categories, products] = await Promise.all([getCategories(), getMenuCatalog()])

  return <MenuBrowser initialData={{ categories, products }} />
}

export default InitialMenu
