import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address?: string) {
  if (!address) return "Unknown";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEth(amount?: bigint) {
  if (amount === undefined) return "0 ETH";
  const formatted = Number(formatEther(amount)).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
  return `${formatted} ETH`;
}
