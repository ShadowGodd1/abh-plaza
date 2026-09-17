import { redirect } from "next/navigation";
import { getPayments, getCurrentOccupancy } from "@/lib/data";
import OwnerPaymentsClient from "./owner-payments-client";

export default async function OwnerPaymentsPage() {
  const occupancy = await getCurrentOccupancy("owner");
  if (!occupancy) redirect("/login");

  const payments = await getPayments();

  return <OwnerPaymentsClient payments={payments} ownerName={occupancy.personName} unitLabel={occupancy.unitLabel} />;
}
