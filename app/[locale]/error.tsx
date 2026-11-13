"use client"

import type { ReactElement } from "react"

import ErrorState from "@/components/shared/ErrorState"

interface IProps {
  error: unknown
  retry: () => void
}

const RouteError = ({ retry }: IProps): ReactElement => {
  return (
    <ErrorState
      kind="unexpected"
      onRetry={retry}
    />
  )
}

export default RouteError
