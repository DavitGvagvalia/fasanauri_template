import type { ReactElement } from "react"
import { getTranslations } from "next-intl/server"
import { LogIn } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

const LoginPage = async (): Promise<ReactElement> => {
  const t = await getTranslations("Login")

  return (
    <main
      id="main-content"
      className="site-container flex min-h-[65vh] flex-col items-center justify-center gap-5 py-12 text-center"
    >
      <div className="rounded-full bg-muted p-5">
        <LogIn
          className="size-7"
          aria-hidden
        />
      </div>
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="max-w-lg text-sm leading-7 text-muted-foreground">{t("description")}</p>
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", className: "h-11" })}
      >
        {t("back")}
      </Link>
    </main>
  )
}

export default LoginPage
