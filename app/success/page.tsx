import { SuccessScreen } from "@/components/screens/success-screen";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; billId?: string }>;
}) {
  const params = await searchParams;
  return <SuccessScreen amount={params.amount} billId={params.billId} />;
}
