import Link from "next/link";
import { getApplicants } from "@/lib/data";
import ApplicantsListClient from "./applicants-list-client";

export default async function ApplicantsPage() {
  const applicants = await getApplicants();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span>Properties</span>
            <span>/</span>
            <span className="text-text-primary">Applicants</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Applicants</h1>
          <p className="text-sm text-text-3 mt-1">Track prospective tenants through the pipeline.</p>
        </div>
      </div>

      <ApplicantsListClient initialApplicants={applicants} />
    </div>
  );
}
