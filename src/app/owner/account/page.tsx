import { getUnits } from "@/lib/data";
import OwnerAccountClient from "./owner-account-client";

export default async function OwnerAccountPage() {
  const units = await getUnits();

  return <OwnerAccountClient units={units} />;
}
