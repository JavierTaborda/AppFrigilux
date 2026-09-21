export function formatAmount(amount: number, currency: string) {
  const intlCurrency = currency === "US$" ? "USD" : currency === "VES" ? "VES" : null;

  if (!intlCurrency) {
    return `${Number(amount).toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  }

  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: intlCurrency,
  }).format(Number(amount));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-VE", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}