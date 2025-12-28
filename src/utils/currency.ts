export function formatCurrency(amount: number, currency: string = "NGN"): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    console.warn("Failed to format currency", error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}
