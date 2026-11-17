export const showOrderBrowserNotification = (
  title: string,
  body: string,
  orderId: number,
  onOpen: () => void
): void => {
  if (
    typeof window === "undefined" ||
    !window.isSecureContext ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return
  }
  try {
    const notification = new Notification(title, { body, tag: `order-confirmation-${orderId}` })
    notification.onclick = (): void => {
      window.focus()
      onOpen()
      notification.close()
    }
  } catch {
    // unsupported browser notification constructors must not interrupt in app alerts.
  }
}
