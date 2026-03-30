"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { CONTRACT_ADDRESS, splitBillAbi } from "@/lib/contract";
import { saveActivityRecord, saveKnownBill } from "@/lib/storage";
import { useLatestMatchingBill } from "@/hooks/use-bills";

const quickAmounts = ["10", "20", "50"];

export function CreateBillScreen() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("10");
  const [submittedAmount, setSubmittedAmount] = useState<bigint>();
  const { data: txHash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
  const { data: latestBill } = useLatestMatchingBill({
    creator: address,
    amount: submittedAmount,
  });

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : "Create bill failed";
      toast.error(message);
    }
  }, [error]);

  useEffect(() => {
    if (!isSuccess || !txHash || !address || submittedAmount === undefined) return;

    if (latestBill) {
      saveKnownBill(latestBill.id);
      saveActivityRecord({
        type: "created",
        billId: latestBill.id,
        amount: submittedAmount.toString(),
        txHash,
        user: address,
        timestamp: Date.now(),
      });
    }

    toast.success("Bill created");
    router.push("/");
  }, [address, isSuccess, latestBill, router, submittedAmount, txHash]);

  const submit = () => {
    if (!isConnected) {
      toast.error("Connect your wallet to create a bill");
      return;
    }

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const value = parseEther(amount);
    setSubmittedAmount(value);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: splitBillAbi,
      functionName: "createBill",
      args: [value],
    });
  };

  return (
    <AppShell
      title="Create a new bill"
      subtitle="Set the amount in ETH, publish it on Base, and send people straight to payment."
    >
      <section className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-card sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-deep/60">Amount</p>
        <div className="mt-4 rounded-[2rem] bg-canvas p-6">
          <input
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full bg-transparent text-5xl font-semibold tracking-tight text-ink outline-none"
            placeholder="0.00"
          />
          <p className="mt-3 text-sm text-ink/55">ETH</p>
        </div>

        <div className="mt-6 flex gap-3">
          {quickAmounts.map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className="rounded-full bg-primary-soft px-5 py-3 text-sm font-semibold text-primary-deep transition hover:bg-blue-200"
            >
              {value} ETH
            </button>
          ))}
        </div>

        <button
          onClick={submit}
          disabled={isPending || isConfirming}
          className="mt-8 w-full rounded-[1.75rem] bg-primary px-6 py-5 text-lg font-semibold text-white transition hover:bg-primary-deep disabled:opacity-60"
        >
          {isPending || isConfirming ? "Creating..." : "Create"}
        </button>
      </section>
    </AppShell>
  );
}
