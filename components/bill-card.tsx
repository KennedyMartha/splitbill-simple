"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import type { Bill } from "@/lib/bills";
import { formatEth, shortenAddress } from "@/lib/utils";
import { StatusTag } from "@/components/status-tag";

export function BillCard({ bill }: { bill: Bill }) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const onPayClick = () => {
    if (!isConnected) {
      const connector = connectors.find((item) =>
        item.name.toLowerCase().includes("coinbase"),
      );
      if (connector) connect({ connector });
      return;
    }
    router.push(`/bill/${bill.id}`);
  };

  return (
    <article className="min-w-[288px] rounded-4xl border border-white/70 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink/55">Bill #{bill.id}</span>
        <StatusTag paid={bill.paid} />
      </div>
      <Link href={`/bill/${bill.id}`} className="mt-8 block">
        <p className="text-4xl font-semibold tracking-tight text-ink">{formatEth(bill.amount)}</p>
        <p className="mt-4 text-sm text-ink/60">Creator {shortenAddress(bill.creator)}</p>
      </Link>
      {!bill.paid ? (
        <button
          onClick={onPayClick}
          className="mt-8 w-full rounded-3xl bg-primary px-5 py-4 text-base font-semibold text-white transition hover:bg-primary-deep"
        >
          Pay
        </button>
      ) : null}
    </article>
  );
}
