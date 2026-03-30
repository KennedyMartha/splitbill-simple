"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/app-shell";
import { StatusTag } from "@/components/status-tag";
import { useBills, useRecentActivity } from "@/hooks/use-bills";
import { formatEth } from "@/lib/utils";

type Tab = "created" | "paid";

export function MyBillsScreen() {
  const [tab, setTab] = useState<Tab>("created");
  const { address } = useAccount();
  const { data: bills = [] } = useBills();
  const activity = useRecentActivity();

  const items = useMemo(() => {
    if (!address) return [];
    if (tab === "created") {
      return bills.filter((bill) => bill.creator.toLowerCase() === address.toLowerCase());
    }

    const paidIds = new Set(
      activity
        .filter(
          (record) =>
            record.type === "paid" && record.user.toLowerCase() === address.toLowerCase(),
        )
        .map((record) => record.billId),
    );
    return bills.filter((bill) => paidIds.has(bill.id));
  }, [activity, address, bills, tab]);

  return (
    <AppShell
      title="My bills"
      subtitle="Switch between bills you created and bills you have already paid from this device."
    >
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
        <div className="flex gap-3">
          {(["created", "paid"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                tab === value
                  ? "bg-primary text-white"
                  : "bg-primary-soft text-primary-deep"
              }`}
            >
              {value === "created" ? "Created" : "Paid"}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {items.length ? (
            items.map((bill) => (
              <Link
                key={bill.id}
                href={`/bill/${bill.id}`}
                className="flex items-center justify-between rounded-[1.75rem] bg-canvas px-5 py-5 transition hover:bg-primary-soft"
              >
                <div>
                  <p className="text-sm text-ink/50">Bill #{bill.id}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-ink">{formatEth(bill.amount)}</h3>
                </div>
                <StatusTag paid={bill.paid} />
              </Link>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-primary/20 bg-canvas px-5 py-10 text-sm text-ink/55">
              {address
                ? "No bills in this tab yet."
                : "Connect your wallet to filter bills you created or paid."}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
