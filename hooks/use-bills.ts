"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { findLatestMatchingBill, getBillById, scanBills, type Bill } from "@/lib/bills";
import { getActivityRecords, getKnownBills } from "@/lib/storage";

export function useBills() {
  const [knownIds, setKnownIds] = useState<number[]>([]);

  useEffect(() => {
    setKnownIds(getKnownBills());
  }, []);

  return useQuery({
    queryKey: ["bills", knownIds],
    queryFn: async () => {
      const scanned = await scanBills(18);
      const uniqueIds = Array.from(new Set([...knownIds, ...scanned.map((bill) => bill.id)]));
      const extraBills = await Promise.all(
        uniqueIds
          .filter((id) => !scanned.some((bill) => bill.id === id))
          .map((id) => getBillById(id)),
      );
      const hydratedExtraBills = extraBills.filter((bill): bill is Bill => Boolean(bill));

      return [...scanned, ...hydratedExtraBills].sort((a, b) => b.id - a.id);
    },
  });
}

export function useBill(id: number) {
  return useQuery({
    queryKey: ["bill", id],
    queryFn: () => getBillById(id),
    enabled: Number.isFinite(id),
  });
}

export function useLatestMatchingBill(params: { creator?: string; amount?: bigint }) {
  return useQuery({
    queryKey: ["latest-bill", params.creator, params.amount?.toString()],
    queryFn: () => findLatestMatchingBill(params),
    enabled: Boolean(params.creator && params.amount !== undefined),
  });
}

export function useRecentActivity() {
  const [records, setRecords] = useState(getActivityRecords());

  useEffect(() => {
    setRecords(getActivityRecords());
  }, []);

  return useMemo(() => records, [records]);
}
