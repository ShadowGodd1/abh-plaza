import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountInCents: number): string {
  const amount = amountInCents / 100;
  return `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  });
}

export function formatPhoneDisplay(phone: string): string {
  if (phone.length === 12 && phone.startsWith("254")) {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  }
  return phone;
}

export function normalizeKenyanPhone(input: string): string {
  let cleaned = input.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  }

  if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("1"))) {
    cleaned = "254" + cleaned;
  }

  return cleaned;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): { bg: string; text: string; dot: string } {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    paid: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
    resolved: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
    occupied: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
    pending: { bg: "bg-warning-bg", text: "text-warning", dot: "bg-warning" },
    partial: { bg: "bg-warning-bg", text: "text-warning", dot: "bg-warning" },
    open: { bg: "bg-warning-bg", text: "text-warning", dot: "bg-warning" },
    overdue: { bg: "bg-danger-bg", text: "text-danger", dot: "bg-danger" },
    in_progress: { bg: "bg-info-bg", text: "text-info", dot: "bg-info" },
    vacant: { bg: "bg-surface-2", text: "text-text-3", dot: "bg-text-3" },
    reserved: { bg: "bg-warning-bg", text: "text-gold-dark", dot: "bg-gold" },
    under_maintenance: { bg: "bg-danger-bg", text: "text-danger", dot: "bg-danger" },
    active: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
    expired: { bg: "bg-warning-bg", text: "text-warning", dot: "bg-warning" },
    terminated: { bg: "bg-danger-bg", text: "text-danger", dot: "bg-danger" },
    ended: { bg: "bg-surface-2", text: "text-text-3", dot: "bg-text-3" },
    void: { bg: "bg-surface-2", text: "text-text-3", dot: "bg-text-3" },
    failed: { bg: "bg-danger-bg", text: "text-danger", dot: "bg-danger" },
    completed: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
    approved: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
    rejected: { bg: "bg-danger-bg", text: "text-danger", dot: "bg-danger" },
    converted: { bg: "bg-info-bg", text: "text-info", dot: "bg-info" },
  };
  return colors[status] || { bg: "bg-surface-2", text: "text-text-3", dot: "bg-text-3" };
}

export function getStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
