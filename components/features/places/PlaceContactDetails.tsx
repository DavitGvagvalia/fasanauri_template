import { Mail, MapPin, Megaphone, Phone } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { ReactElement } from "react"

import FooterFacebookLink from "@/components/shared/FooterFacebookLink"
import { PLACE_CONTACTS } from "@/constants"
import type { IPlace } from "@/types/place"

interface IProps {
  place: IPlace
}

const PlaceContactDetails = ({ place }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Information")
  const contact = PLACE_CONTACTS[place.id]

  return (
    <div className="space-y-10 sm:space-y-12">
      <section>
        <h2 className="mb-5 flex items-center gap-3 text-lg font-medium">
          <MapPin
            className="size-5 text-muted-foreground"
            aria-hidden
          />
          {t("location")}
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          {contact?.address[locale] ?? t("contactPlaceholder")}
        </p>
        <a
          href={place.mapsURL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-2 inline-block text-sm text-muted-foreground"
        >
          {t("viewMap")}
        </a>
      </section>
      <section>
        <h2 className="mb-5 flex items-center gap-3 text-lg font-medium">
          <Phone
            className="size-5 text-muted-foreground"
            aria-hidden
          />
          {t("phones")}
        </h2>
        {contact ? (
          <ul className="space-y-2 text-muted-foreground">
            {contact.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:+995${phone}`}
                  className="link-underline"
                >
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t("contactPlaceholder")}</p>
        )}
      </section>
      <section>
        <h2 className="mb-5 flex items-center gap-3 text-lg font-medium">
          <Mail
            className="size-5 text-muted-foreground"
            aria-hidden
          />
          {t("email")}
        </h2>
        {contact ? (
          <a
            href={`mailto:${contact.email}`}
            className="link-underline text-muted-foreground [overflow-wrap:anywhere]"
          >
            {contact.email}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">{t("contactPlaceholder")}</p>
        )}
      </section>
      <section>
        <h2 className="mb-5 flex items-center gap-3 text-lg font-medium">
          <Megaphone
            className="size-5 text-muted-foreground"
            aria-hidden
          />
          {t("social")}
        </h2>
        <FooterFacebookLink />
      </section>
    </div>
  )
}

export default PlaceContactDetails
