import type { ReactElement } from "react"
import type { TShareNetwork } from "@/types/menuSharing"

interface IProps {
  network: TShareNetwork
}

// shared brand artwork is used by footer and sharing links, application controls remain Lucide.
const SocialIcon = ({ network }: IProps): ReactElement => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 shrink-0"
      aria-hidden
    >
      {network === "facebook" && (
        <path d="M14 22v-9h3l.5-3.5H14V7.3c0-1 .3-1.8 1.8-1.8H18V2.4A22 22 0 0 0 15.4 2C12.8 2 11 3.6 11 6.6v2.9H8V13h3v9z" />
      )}
      {network === "twitter" && (
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l8.2-9.4L.8 2h6.5l5.8 7.7L18.9 2Zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20Z" />
      )}
      {network === "pinterest" && (
        <>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="m8 22 3-13m-.7 6c3 2 7-1 7-5 0-7-11-7-11 0 0 2 1 3 2 3m3-3c-1 4 0 6 2 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </>
      )}
      {network === "linkedin" && (
        <>
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="7"
            cy="7"
            r="1.4"
          />
          <path d="M5.8 10h2.4v8H5.8zm5 0h2.3v1.1c.7-1.3 4.9-2.4 4.9 2.8V18h-2.4v-4c0-2.3-2.4-2.2-2.4 0v4h-2.4z" />
        </>
      )}
    </svg>
  )
}

export default SocialIcon
