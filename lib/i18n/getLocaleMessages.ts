import en from "@/messages/en.json"
import ka from "@/messages/ka.json"
import ru from "@/messages/ru.json"
import type { TLocale } from "@/types/locale"

const MESSAGES = { en, ka, ru }

export const getLocaleMessages = (locale: TLocale): typeof en => {
  return MESSAGES[locale]
}
