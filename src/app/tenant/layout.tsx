import TenantNav from "@/components/tenant/tenant-nav";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper density-comfortable">
      <main className="pb-20 lg:pb-0">{children}</main>
      <TenantNav />
    </div>
  );
}
