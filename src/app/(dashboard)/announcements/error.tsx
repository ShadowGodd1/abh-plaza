"use client";
export default function AnnouncementsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-ink mb-2">Announcements Error</h2>
      <p className="text-sm text-muted mb-6 max-w-sm">Failed to load announcements. Please try again.</p>
      <button onClick={reset} className="btn-primary">Retry</button>
    </div>
  );
}
