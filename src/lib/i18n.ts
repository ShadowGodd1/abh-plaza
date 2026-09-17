type Language = "en" | "sw";

const translations: Record<string, Record<Language, string>> = {
  // Common
  "dashboard": { en: "Dashboard", sw: "Dashibodi" },
  "properties": { en: "Properties", sw: "Mali" },
  "units": { en: "Units", sw: "Vitengo" },
  "occupancies": { en: "Occupancies", sw: "Umiliki" },
  "applicants": { en: "Applicants", sw: "Waombaji" },
  "tenants": { en: "Tenants", sw: "Wapangaji" },
  "billing": { en: "Billing", sw: "Bili" },
  "invoices": { en: "Invoices", sw: "Ankara" },
  "payments": { en: "Payments", sw: "Malipo" },
  "ledger": { en: "Ledger", sw: "Kitabu cha Fedha" },
  "maintenance": { en: "Maintenance", sw: "Uendeshaji" },
  "staff": { en: "Staff & Payroll", sw: "Wafanyakazi" },
  "messages": { en: "Messages", sw: "Ujumbe" },
  "announcements": { en: "Announcements", sw: "Tangazo" },
  "reports": { en: "Reports", sw: "Ripoti" },
  "settings": { en: "Settings", sw: "Mipangilio" },
  "logout": { en: "Log out", sw: "Ondoka" },
  "search": { en: "Search", sw: "Tafuta" },
  "save": { en: "Save", sw: "Hifadhi" },
  "cancel": { en: "Cancel", sw: "Ghairi" },
  "delete": { en: "Delete", sw: "Futa" },
  "edit": { en: "Edit", sw: "Hariri" },
  "add": { en: "Add", sw: "Ongeza" },
  "submit": { en: "Submit", sw: "Wasilisha" },
  "confirm": { en: "Confirm", sw: "Thibitisha" },
  "close": { en: "Close", sw: "Funga" },
  "loading": { en: "Loading...", sw: "Inapakia..." },
  "no_data": { en: "No data available", sw: "Hakuna data" },
  "occupied_units": { en: "Occupied Units", sw: "Vitengo Vilivyolishwa" },
  "vacant_units": { en: "Vacant Units", sw: "Vitengo Tupu" },
  "collection": { en: "Collection", sw: "Ukusanyaji" },
  "overdue": { en: "Overdue", sw: "Zilizopita" },
  "paid": { en: "Paid", sw: "Imelipwa" },
  "pending": { en: "Pending", sw: "Inasubiri" },
  "active": { en: "Active", sw: "Hai" },
  "expired": { en: "Expired", sw: "Imeisha" },
  "vacant": { en: "Vacant", sw: "Tupu" },
  "occupied": { en: "Occupied", sw: "Imeshughulikiwa" },
};

let currentLanguage: Language = "en";

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem("abh-lang", lang);
  }
}

export function getLanguage(): Language {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("abh-lang") as Language;
    if (saved) currentLanguage = saved;
  }
  return currentLanguage;
}

export function t(key: string): string {
  return translations[key]?.[currentLanguage] || translations[key]?.["en"] || key;
}
