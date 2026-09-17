"use client";

import { useState, useEffect } from "react";
import { WifiOff, CheckCircle } from "lucide-react";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (!navigator.onLine) return;
      setWasOffline(true);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(false);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-0 inset-x-0 z-[90] bg-warning-bg border-b border-warning/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <WifiOff size={16} className="text-warning shrink-0" />
          <p className="text-sm font-medium text-warning">
            You&apos;re offline. Some features may be unavailable.
          </p>
        </div>
      </div>
    );
  }

  if (showRestored) {
    return (
      <div className="fixed top-0 inset-x-0 z-[90] animate-[toast-slide-in-bottom_0.2s_ease-out]">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] border border-success/20 bg-success-bg shadow-[var(--shadow-dropdown)]">
            <CheckCircle size={16} className="text-success shrink-0" />
            <p className="text-sm font-medium text-success">Connection restored.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
