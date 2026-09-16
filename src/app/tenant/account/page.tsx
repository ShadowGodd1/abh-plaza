import { getUnits } from "@/lib/data";
import TenantAccountClient from "./tenant-account-client";

export default async function TenantAccountPage() {
  const units = await getUnits();

  const tenantUnit = units.find((u: any) => u.label === "A-04");
  const tenantName = tenantUnit?.tenant || "Ahmed Noor";
  const initials = tenantName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TenantAccountClient
      name={tenantName}
      initials={initials}
      unitLabel={tenantUnit?.label || "A-04"}
    />
  );
}
