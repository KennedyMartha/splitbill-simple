import { BillDetailScreen } from "@/components/screens/bill-detail-screen";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BillDetailScreen billId={id} />;
}
