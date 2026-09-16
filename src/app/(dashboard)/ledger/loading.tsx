export default function LedgerLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-warm-gray/30 rounded" />
        <div className="h-10 w-24 bg-warm-gray/20 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5">
            <div className="h-4 w-20 bg-warm-gray/20 rounded mb-2" />
            <div className="h-8 w-28 bg-warm-gray/30 rounded" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-warm-gray/20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-warm-gray/20 rounded" />
                <div className="h-3 w-32 bg-warm-gray/10 rounded" />
              </div>
              <div className="h-6 w-24 bg-warm-gray/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
