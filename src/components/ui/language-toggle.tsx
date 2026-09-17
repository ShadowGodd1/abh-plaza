"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLanguage, setLanguage } from "@/lib/i18n";

export default function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getLanguage());
  }, []);

  const toggle = () => {
    const next = lang === "en" ? "sw" : "en";
    setLanguage(next);
    setLang(next);
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-text-3">
        <Globe size={18} />
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "h-8 px-2.5 rounded-[var(--radius-md)] flex items-center gap-1.5 text-xs font-semibold transition-colors",
        "border border-border hover:bg-surface-2",
        lang === "sw"
          ? "bg-gold/10 text-gold border-gold/30"
          : "bg-surface-2 text-text-2"
      )}
      aria-label={`Switch to ${lang === "en" ? "Swahili" : "English"}`}
      title={`Switch to ${lang === "en" ? "Swahili" : "English"}`}
    >
      <Globe size={14} />
      {lang.toUpperCase()}
    </button>
  );
}
