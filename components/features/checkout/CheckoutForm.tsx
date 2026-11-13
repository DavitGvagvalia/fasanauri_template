"use client"

import type { ReactElement } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { checkoutSchema } from "@/schemas/checkoutSchema"
import CheckoutPhoneInput from "@/components/features/checkout/CheckoutPhoneInput"
import type { TCheckoutValues } from "@/types/checkout"

interface IProps {
  onComplete: () => void
  disabled?: boolean
}

const CheckoutForm = ({ onComplete, disabled = false }: IProps): ReactElement => {
  const t = useTranslations("Checkout")
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<TCheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "all",
    defaultValues: { name: "", phone: "", address: "" },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onComplete)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="checkout-name">{t("name")}</Label>
        <Input
          id="checkout-name"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          maxLength={100}
          aria-invalid={!!errors.name && touchedFields.name}
          aria-describedby={errors.name && touchedFields.name ? "name-error" : undefined}
          {...register("name")}
          className="h-11"
        />
        {errors.name && touchedFields.name && (
          <p
            id="name-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {t("nameError")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkout-phone">{t("phone")}</Label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <CheckoutPhoneInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              invalid={!!errors.phone && !!touchedFields.phone}
            />
          )}
        />
        {errors.phone && touchedFields.phone && (
          <p
            id="phone-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {t("phoneError")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkout-address">{t("address")}</Label>
        <Input
          id="checkout-address"
          autoComplete="street-address"
          placeholder={t("addressPlaceholder")}
          maxLength={300}
          aria-invalid={!!errors.address && touchedFields.address}
          aria-describedby={errors.address && touchedFields.address ? "address-error" : undefined}
          {...register("address")}
          className="h-11"
        />
        {errors.address && touchedFields.address && (
          <p
            id="address-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {t("addressError")}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={disabled || isSubmitting || !isValid}
        className="h-11 w-full"
      >
        {t("submit")}
      </Button>
    </form>
  )
}

export default CheckoutForm
