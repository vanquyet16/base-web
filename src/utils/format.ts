export function formatCurrency(amount: number, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string, format: "short" | "long" = "short") {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: format === "short" ? "short" : "long",
  }).format(value);
}
