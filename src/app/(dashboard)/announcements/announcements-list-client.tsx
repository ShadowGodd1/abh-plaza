"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, Send, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { formatDate, cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  body: string;
  sentToAll: boolean;
  sentAt: string;
  deliveredTo?: number;
  pendingDelivery?: number;
}

interface AnnouncementsListClientProps {
  initialAnnouncements: Announcement[];
}

export default function AnnouncementsListClient({ initialAnnouncements }: AnnouncementsListClientProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [announcements] = useState(initialAnnouncements);
  const [sending, setSending] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formAudience, setFormAudience] = useState("all");

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setShowConfirmSend(false);
    setShowCreate(false);
    setFormTitle("");
    setFormBody("");
    setFormAudience("all");
  };

  const getDeliveryStatus = (ann: Announcement) => {
    const pending = ann.pendingDelivery ?? 0;
    const delivered = ann.deliveredTo ?? 0;
    const total = delivered + pending;

    if (pending === 0 && delivered > 0) {
      return { label: `Delivered to ${delivered} recipients`, type: "delivered" as const };
    }
    if (pending > 0) {
      return { label: `Pending delivery (${delivered}/${total} sent)`, type: "pending" as const };
    }
    return { label: `Sent to: ${ann.sentToAll ? "All residents" : "Selected"}`, type: "sent" as const };
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => {
          const delivery = getDeliveryStatus(ann);
          return (
            <div key={ann.id} className="bg-surface rounded-[var(--radius-lg)] border border-border p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Megaphone size={18} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-text-primary mb-1">{ann.title}</h3>
                  <p className="text-sm text-text-2 leading-relaxed">{ann.body}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-text-3">
                    <span>{delivery.label}</span>
                    <span>·</span>
                    <span>{formatDate(ann.sentAt)}</span>
                    {delivery.type === "delivered" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                        <CheckCircle2 size={12} />
                        Delivered
                      </span>
                    )}
                    {delivery.type === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create announcement modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Announcement"
        description="Send an announcement to residents"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Announcement title"
            id="ann-title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <Textarea
            label="Message"
            placeholder="Write your announcement..."
            id="ann-body"
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Audience</label>
            <select
              value={formAudience}
              onChange={(e) => setFormAudience(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Residents</option>
              <option value="tenants">Tenants Only</option>
              <option value="owners">Owners Only</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => setShowConfirmSend(true)}>
              <Send size={16} />
              Send Announcement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation dialog */}
      <Modal
        open={showConfirmSend}
        onClose={() => setShowConfirmSend(false)}
        title="Send announcement?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-gold" />
            </div>
            <div>
              <p className="text-sm text-text-primary">
                This will be sent to all {formAudience === "all" ? "residents" : formAudience === "tenants" ? "tenants" : "owners"}.
              </p>
              {formTitle && (
                <p className="text-sm text-text-3 mt-1">
                  Title: <span className="font-medium text-text-primary">{formTitle}</span>
                </p>
              )}
              <p className="text-sm text-text-3 mt-1">
                The announcement will be processed and delivered via in-app notification and SMS where applicable.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowConfirmSend(false)}>
              Cancel
            </Button>
            <Button loading={sending} onClick={handleSend}>
              <Send size={16} />
              Send announcement
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
