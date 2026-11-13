import type { ReactElement } from "react"
import { Suspense } from "react"

import InitialMenu from "@/components/features/menu/InitialMenu"
import MenuLoading from "@/components/features/menu/MenuLoading"

const HomePage = (): ReactElement => {
  return (
    <Suspense fallback={<MenuLoading />}>
      <InitialMenu />
    </Suspense>
  )
}

export default HomePage
