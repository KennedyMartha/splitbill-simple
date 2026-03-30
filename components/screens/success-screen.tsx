"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { AppShell } from "@/components/app-shell";

export function SuccessScreen({
  amount: rawAmount,
  billId,
}: {
  amount?: string;
  billId?: string;
}) {
  const amount = rawAmount ? `${Number(formatEther(BigInt(rawAmount))).toLocaleString()} ETH` : "ETH";

  return (
    <AppShell
      title="Payment Success"
      subtitle="The bill is settled, the transaction is attributed, and the record stays visible from the home feed."
    >
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-[2rem] border border-white/70 bg-white p-10 text-center shadow-card">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
          ?
        </div>
        <h2 className="mt-6 text-4xl font-semibold tracking-tight text-ink">{amount}</h2>
        <p className="mt-3 text-sm text-ink/60">
          Bill {billId ? `#${billId}` : ""} has been paid successfully on Base.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-[1.75rem] bg-primary px-6 py-4 text-base font-semibold text-white transition hover:bg-primary-deep"
        >
          Back Home
        </Link>
      </section>
    </AppShell>
  );
}
