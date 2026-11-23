/** INR money helpers. Transactional amounts are integer paise. */

export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) throw new RangeError("Amount must be a finite number");
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function isValidPaise(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(rupees: number): string {
  return inrFormatter.format(rupees);
}

export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  if (Number.isInteger(rupees)) return inrFormatter.format(rupees);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(rupees);
}
