import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EachRoute, ROUTES } from "./routes-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatCurrency = (amount: number, currencySymbol: string) => {
  // Handle negative numbers
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // For amounts 100,000 and above, use abbreviated format
  if (absAmount >= 100000) {
    let formattedAmount: string;

    if (absAmount >= 1000000000) {
      // Billions
      formattedAmount =
        (absAmount / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (absAmount >= 1000000) {
      // Millions
      formattedAmount =
        (absAmount / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else {
      // Thousands (100K+)
      formattedAmount = (absAmount / 1000).toFixed(0) + "K";
    }

    return `${isNegative ? "-" : ""}${currencySymbol}${formattedAmount}`;
  }

  // For amounts below 100,000, use comma formatting
  const formattedAmount = absAmount.toLocaleString("en-US");

  return `${isNegative ? "-" : ""}${currencySymbol}${formattedAmount}`;
};
export function helperSearch(
  query: string,
  node: EachRoute,
  prefix: string,
  currenLevel: number,
  maxLevel?: number
) {
  const res: EachRoute[] = [];
  let parentHas = false;

  const nextLink = `${prefix}${node.href}`;
  if (!node.noLink && node.title.toLowerCase().includes(query.toLowerCase())) {
    res.push({ ...node, items: undefined, href: nextLink });
    parentHas = true;
  }
  const goNext = maxLevel ? currenLevel < maxLevel : true;
  if (goNext)
    node.items?.forEach((item) => {
      const innerRes = helperSearch(
        query,
        item,
        nextLink,
        currenLevel + 1,
        maxLevel
      );
      if (!!innerRes.length && !parentHas && !node.noLink) {
        res.push({ ...node, items: undefined, href: nextLink });
        parentHas = true;
      }
      res.push(...innerRes);
    });
  return res;
}

export function advanceSearch(query: string) {
  return ROUTES.map((node) =>
    helperSearch(query, node, "", 1, query.length == 0 ? 2 : undefined)
  ).flat();
}

// Thursday, May 23, 2024
export function formatDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
export function formatISODate(dateStr: Date): string {
  // No need to parse the date as it's already a Date object
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
//  May 23, 2024
export function formatDate2(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}
