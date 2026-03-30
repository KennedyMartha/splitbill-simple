"use client";

export type ActivityRecord = {
  type: "created" | "paid";
  billId: number;
  amount: string;
  txHash: string;
  user: string;
  timestamp: number;
};

const KNOWN_BILLS_KEY = "splitbill-known-bills";
const ACTIVITY_KEY = "splitbill-activity";

export function getKnownBills() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KNOWN_BILLS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function saveKnownBill(id: number) {
  if (typeof window === "undefined") return;
  const next = Array.from(new Set([id, ...getKnownBills()])).sort((a, b) => b - a);
  window.localStorage.setItem(KNOWN_BILLS_KEY, JSON.stringify(next.slice(0, 40)));
}

export function getActivityRecords() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACTIVITY_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as ActivityRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveActivityRecord(record: ActivityRecord) {
  if (typeof window === "undefined") return;
  const next = [record, ...getActivityRecords()].slice(0, 30);
  window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
}
