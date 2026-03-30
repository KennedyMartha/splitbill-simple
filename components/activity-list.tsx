"use client";

import Link from "next/link";
import { useRecentActivity } from "@/hooks/use-bills";
import { shortenAddress } from "@/lib/utils";

export function ActivityList() {
  const records = useRecentActivity();

  return (
    <section className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Recent Activity</h2>
        <span className="text-sm text-ink/50">{records.length} records</span>
      </div>
      <div className="mt-5 space-y-3">
        {records.length ? (
          records.map((record) => (
            <Link
              key={`${record.txHash}-${record.timestamp}`}
              href={`/bill/${record.billId}`}
              className="flex items-center justify-between rounded-3xl bg-canvas px-4 py-4 transition hover:bg-primary-soft"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-deep/70">
                  {record.type}
                </p>
                <p className="mt-2 text-sm text-ink/70">
                  Bill #{record.billId} by {shortenAddress(record.user)}
                </p>
              </div>
              <p className="text-sm font-semibold text-primary">View</p>
            </Link>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-primary/20 bg-canvas px-4 py-8 text-sm text-ink/55">
            Create or pay a bill to start building your activity trail.
          </div>
        )}
      </div>
    </section>
  );
}
