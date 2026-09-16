export default function BillingLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-warm-gray/30 rounded" />
        <div className="h-10 w-32 bg-warm-gray/20 rounded-lg" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-20 bg-warm-gray/20 rounded-lg" />
        ))}
      </div>
      <div className="card">
        <div className="p-4 border-b border-border">
          <div className="flex gap-4">
            <div className="h-10 flex-1 bg-warm-gray/10 rounded-lg" />
            <div className="h-10 w-24 bg-warm-gray/10 rounded-lg" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-warm-gray/20 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-warm-gray/20 rounded" />
                <div className="h-3 w-32 bg-warm-gray/10 rounded" />
              </div>
              <div className="h-6 w-20 bg-warm-gray/20 rounded" />
              <div className="h-6 w-16 bg-warm-gray/20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
