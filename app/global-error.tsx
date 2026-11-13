"use client"

import type { ReactElement } from "react"

import StandaloneErrorDocument from "@/components/shared/StandaloneErrorDocument"

interface IProps {
  error: unknown
  retry: () => void
}

const GlobalError = ({ retry }: IProps): ReactElement => {
  return (
    <StandaloneErrorDocument
      kind="unexpected"
      onRetry={retry}
    />
  )
}

export default GlobalError
