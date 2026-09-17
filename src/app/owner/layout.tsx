import OwnerNav from "@/components/owner/owner-nav";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper density-comfortable">
      <main className="pb-20 lg:pb-0">{children}</main>
      <OwnerNav />
    </div>
  );
}
