import type { ReactElement } from "react"
import ErrorState from "@/components/shared/ErrorState"

const NotFoundPage = (): ReactElement => {
  return <ErrorState kind="notFound" />
}

export default NotFoundPage
