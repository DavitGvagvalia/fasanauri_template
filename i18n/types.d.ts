import type messages from "@/messages/en.json"
import type { TLocale } from "@/types/locale"

declare module "next-intl" {
  interface AppConfig {
    Locale: TLocale
    Messages: typeof messages
  }
}
