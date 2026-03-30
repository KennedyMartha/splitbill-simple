import { readContract } from "@wagmi/core";
import { zeroAddress } from "viem";
import { config } from "@/app/wagmi";
import { CONTRACT_ADDRESS, splitBillAbi } from "@/lib/contract";

export type Bill = {
  id: number;
  creator: `0x${string}`;
  amount: bigint;
  paid: boolean;
};

export async function getBillById(id: number) {
  const [creator, amount, paid] = await readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: splitBillAbi,
    functionName: "bills",
    args: [BigInt(id)],
  });

  if (creator === zeroAddress || amount === 0n) {
    return null;
  }

  return {
    id,
    creator,
    amount,
    paid,
  } satisfies Bill;
}

export async function scanBills(limit = 18) {
  const results = await Promise.all(
    Array.from({ length: limit }, (_, index) => getBillById(index)),
  );

  return results.filter((bill): bill is Bill => Boolean(bill)).reverse();
}

export async function findLatestMatchingBill({
  creator,
  amount,
  limit = 32,
}: {
  creator?: string;
  amount?: bigint;
  limit?: number;
}) {
  const bills = await scanBills(limit);
  return bills.find(
    (bill) =>
      (!creator || bill.creator.toLowerCase() === creator.toLowerCase()) &&
      (amount === undefined || bill.amount === amount),
  );
}
