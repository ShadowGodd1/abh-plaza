"use client";

import { AlertTriangle, WifiOff, Clock, ShieldAlert, ServerCrash, SearchX } from "lucide-react";
import Button from "@/components/ui/button";

type ErrorType = "network" | "timeout" | "auth" | "server" | "notfound";

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onAction?: () => void;
  className?: string;
}

const ERROR_CONFIG: Record<ErrorType, { icon: React.ReactNode; title: string; message: string; actionLabel: string; actionVariant: "primary" | "secondary" | "danger" }> = {
  network: {
    icon: <WifiOff size={24} className="text-danger" />,
    title: "Connection lost",
    message: "Check your internet connection and try again.",
    actionLabel: "Try again",
    actionVariant: "secondary",
  },
  timeout: {
    icon: <Clock size={24} className="text-warning" />,
    title: "Request timed out",
    message: "The server may be slow. Please try again.",
    actionLabel: "Try again",
    actionVariant: "secondary",
  },
  auth: {
    icon: <ShieldAlert size={24} className="text-danger" />,
    title: "Session expired",
    message: "Your session has expired. Please log in again.",
    actionLabel: "Log in",
    actionVariant: "primary",
  },
  server: {
    icon: <ServerCrash size={24} className="text-danger" />,
    title: "Server error",
    message: "Something went wrong on our end.",
    actionLabel: "Try again",
    actionVariant: "secondary",
  },
  notfound: {
    icon: <SearchX size={24} className="text-text-3" />,
    title: "Not found",
    message: "The requested resource was not found.",
    actionLabel: "Go back",
    actionVariant: "secondary",
  },
};

export default function ErrorState({
  type = "server",
  title,
  message,
  onRetry,
  onAction,
  className,
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const handleAction = onAction || onRetry;

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mb-4">
        {config.icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{displayTitle}</h3>
      <p className="text-sm text-text-3 mb-4 max-w-sm">{displayMessage}</p>
      {handleAction && (
        <Button variant={config.actionVariant} onClick={handleAction}>
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
}
