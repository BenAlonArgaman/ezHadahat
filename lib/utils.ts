import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  // Use this to get the ₪ symbol after the number in RTL
  currencyDisplay: "symbol",
});

// Optional: Helper function for formatting prices without the currency symbol
export const priceFormatter = new Intl.NumberFormat("he-IL", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Optional: Helper function to format price with ₪ symbol in the correct position
export const formatPriceWithSymbol = (price: number) => {
  return `${priceFormatter.format(price)} ₪`;
};
