"use client";

import { useState } from "react";
import { LogOut, ChevronRight, Shield, Bell, HelpCircle, Edit3, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TenantAccountClientProps {
  name: string;
  initials: string;
  unitLabel: string;
}

export default function TenantAccountClient({ name, initials, unitLabel }: TenantAccountClientProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: editName },
    });
    setSaving(false);
    if (error) {
      setMessage("Failed to update profile.");
    } else {
      setMessage("Profile updated.");
      setEditing(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Account</h1>

      {/* Profile card */}
      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-primary">Profile</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-gold hover:text-gold-dark transition-colors">
              <Edit3 size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-gold text-lg font-semibold">{initials}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{editing ? editName : name}</p>
            <p className="text-sm text-text-3">Tenant · Unit {unitLabel}</p>
          </div>
        </div>
        {editing && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-sm text-text-3 hover:text-text-primary transition-colors">
                <X size={14} className="inline mr-1" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 text-sm bg-gold text-white rounded-[var(--radius-md)] hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                <Save size={14} className="inline mr-1" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-success-bg border border-success/20">
          <p className="text-sm text-success">{message}</p>
        </div>
      )}

      {/* Menu items */}
      <div className="bg-surface rounded-[var(--radius-lg)] border border-border divide-y divide-border">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2/50 transition-colors">
          <Shield size={18} className="text-text-3" />
          <span className="flex-1 text-sm text-text-primary">Security</span>
          <ChevronRight size={16} className="text-text-3" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2/50 transition-colors">
          <Bell size={18} className="text-text-3" />
          <span className="flex-1 text-sm text-text-primary">Notifications</span>
          <ChevronRight size={16} className="text-text-3" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2/50 transition-colors">
          <HelpCircle size={18} className="text-text-3" />
          <span className="flex-1 text-sm text-text-primary">Help & Support</span>
          <ChevronRight size={16} className="text-text-3" />
        </button>
      </div>

      {/* Sign out */}
      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 mt-6 py-3 text-sm text-danger hover:bg-danger-bg rounded-[var(--radius-lg)] transition-colors">
        <LogOut size={16} />
        Sign out
      </button>

      <p className="text-xs text-text-3 text-center mt-4">ABH Plaza PMS v1.0</p>
    </div>
  );
}
