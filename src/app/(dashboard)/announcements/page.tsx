import { formatDate } from "@/lib/utils";
import { getAnnouncements } from "@/lib/data";
import AnnouncementsListClient from "./announcements-list-client";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <a href="/dashboard" className="hover:text-gold transition-colors">Dashboard</a>
            <span>/</span>
            <span className="text-text-primary">Announcements</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Announcements</h1>
          <p className="text-sm text-text-3 mt-1">Send bulk messages to all residents.</p>
        </div>
      </div>

      <AnnouncementsListClient initialAnnouncements={announcements} />
    </div>
  );
}
