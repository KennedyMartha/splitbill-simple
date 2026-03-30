"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ActivityList } from "@/components/activity-list";
import { BillCard } from "@/components/bill-card";
import { useBills } from "@/hooks/use-bills";

export function HomeScreen() {
  const { data: bills = [], isLoading } = useBills();

  return (
    <AppShell
      title="Shared bills, settled cleanly"
      subtitle="Create a bill, collect a payment on Base, and keep a clear attribution trail without turning the homepage into a wallet gate."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-card backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-deep/60">
                Live Bills
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Open and recent balances</h2>
            </div>
            <Link
              href="/create"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep"
            >
              Create Bill
            </Link>
          </div>

          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="min-w-[288px] animate-pulse rounded-4xl bg-primary-soft p-8"
                />
              ))
            ) : bills.length ? (
              bills.map((bill) => <BillCard key={bill.id} bill={bill} />)
            ) : (
              <div className="rounded-4xl border border-dashed border-primary/25 bg-canvas px-6 py-10 text-sm text-ink/55">
                No bills found yet. Create the first one and it will appear here.
              </div>
            )}
          </div>
        </section>

        <ActivityList />
      </div>
    </AppShell>
  );
}
