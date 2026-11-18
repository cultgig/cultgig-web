import type { PricingMode } from "../types/marketplace";

export function formatInr(amountInr: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);
}

export function formatPaiseToInr(paise: number): string {
  return formatInr(Math.round(paise / 100));
}

export function formatArtistPrice(
  pricingMode: PricingMode,
  startingPriceInr: number | null,
  priceMaxInr?: number | null
): string {
  if (pricingMode === "quote_required" || startingPriceInr === null) {
    return "Quote required";
  }
  if (pricingMode === "range" && priceMaxInr) {
    return `${formatInr(startingPriceInr)} – ${formatInr(priceMaxInr)}`;
  }
  if (pricingMode === "fixed_package") {
    return `${formatInr(startingPriceInr)} fixed`;
  }
  return `From ${formatInr(startingPriceInr)}`;
}

export function formatReadableDate(isoOrDate: string): string {
  if (!isoOrDate) return "Date flexible";
  const parsed = new Date(isoOrDate);
  if (Number.isNaN(parsed.getTime())) return isoOrDate;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
