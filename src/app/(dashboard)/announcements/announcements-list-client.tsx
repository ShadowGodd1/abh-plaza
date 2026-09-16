"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, Send } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  body: string;
  sentToAll: boolean;
  sentAt: string;
}

interface AnnouncementsListClientProps {
  initialAnnouncements: Announcement[];
}

export default function AnnouncementsListClient({ initialAnnouncements }: AnnouncementsListClientProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [announcements] = useState(initialAnnouncements);

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-surface rounded-[var(--radius-lg)] border border-border p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Megaphone size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary mb-1">{ann.title}</h3>
                <p className="text-sm text-text-2 leading-relaxed">{ann.body}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-3">
                  <span>Sent to: {ann.sentToAll ? "All residents" : "Selected"}</span>
                  <span>·</span>
                  <span>{formatDate(ann.sentAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Announcement"
        description="Send an announcement to residents"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Title" placeholder="Announcement title" id="ann-title" />
          <Textarea label="Message" placeholder="Write your announcement..." id="ann-body" />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Audience</label>
            <select className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
              <option value="all">All Residents</option>
              <option value="tenants">Tenants Only</option>
              <option value="owners">Owners Only</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => setShowCreate(false)}>
              <Send size={16} />
              Send Announcement
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
