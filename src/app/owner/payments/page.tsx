import { getPayments } from "@/lib/data";
import OwnerPaymentsClient from "./owner-payments-client";

export default async function OwnerPaymentsPage() {
  const payments = await getPayments();

  return <OwnerPaymentsClient payments={payments} />;
}
