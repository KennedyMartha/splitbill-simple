"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { StatusTag } from "@/components/status-tag";
import { useBill } from "@/hooks/use-bills";
import { CONTRACT_ADDRESS, splitBillAbi } from "@/lib/contract";
import { saveActivityRecord, saveKnownBill } from "@/lib/storage";
import { formatEth, shortenAddress } from "@/lib/utils";
import { trackTransaction } from "@/utils/track";

const appId = "69ca1e440e56240fea198f0c";
const appName = "SplitBill Simple";

export function BillDetailScreen({ billId }: { billId: string }) {
  const router = useRouter();
  const parsedBillId = Number(billId);
  const { address } = useAccount();
  const { data: bill, isLoading } = useBill(parsedBillId);
  const { data: txHash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : "Payment failed";
      toast.error(message);
    }
  }, [error]);

  useEffect(() => {
    if (!isSuccess || !txHash || !bill || !address) return;

    saveKnownBill(bill.id);
    saveActivityRecord({
      type: "paid",
      billId: bill.id,
      amount: bill.amount.toString(),
      txHash,
      user: address,
      timestamp: Date.now(),
    });
    void trackTransaction({ appId, appName, user: address, txHash });
    toast.success("Payment confirmed");
    router.push(`/success?amount=${bill.amount.toString()}&billId=${bill.id}`);
  }, [address, bill, isSuccess, router, txHash]);

  const onPay = () => {
    if (!bill) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: splitBillAbi,
      functionName: "payBill",
      args: [BigInt(parsedBillId)],
      value: bill.amount,
    });
  };

  return (
    <AppShell
      title="Bill detail"
      subtitle="Review the amount, check the status tag, and pay directly on Base when the bill is still open."
    >
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-card sm:p-8">
        {isLoading ? (
          <div className="h-72 animate-pulse rounded-[1.75rem] bg-primary-soft" />
        ) : bill ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary-deep/60">
                  Bill #{bill.id}
                </p>
                <h2 className="mt-4 text-6xl font-semibold tracking-tight text-ink">
                  {formatEth(bill.amount)}
                </h2>
              </div>
              <StatusTag paid={bill.paid} />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoCard label="Creator" value={shortenAddress(bill.creator)} />
              <InfoCard label="Bill ID" value={`#${bill.id}`} />
              <InfoCard label="Chain" value="Base Mainnet" />
            </div>

            {!bill.paid ? (
              <button
                onClick={onPay}
                disabled={isPending || isConfirming}
                className="mt-8 w-full rounded-[1.75rem] bg-primary px-6 py-5 text-lg font-semibold text-white transition hover:bg-primary-deep disabled:opacity-60"
              >
                {isPending || isConfirming ? "Paying..." : "Pay"}
              </button>
            ) : (
              <Link
                href="/"
                className="mt-8 inline-flex rounded-[1.5rem] bg-primary-soft px-5 py-4 text-sm font-semibold text-primary-deep"
              >
                Back to bills
              </Link>
            )}
          </>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-primary/25 bg-canvas px-6 py-10 text-sm text-ink/55">
            Bill not found. It may be outside the current scan range.
          </div>
        )}
      </section>
    </AppShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-canvas p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-ink/45">{label}</p>
      <p className="mt-3 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
