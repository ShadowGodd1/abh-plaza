export default function MessagesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-warm-gray/30 rounded" />
      <div className="flex gap-6">
        <div className="w-80 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-warm-gray/20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 bg-warm-gray/20 rounded" />
                  <div className="h-3 w-40 bg-warm-gray/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 card p-6 space-y-4">
          <div className="h-6 w-40 bg-warm-gray/20 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 bg-warm-gray/20 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-warm-gray/10 rounded" />
                <div className="h-4 w-64 bg-warm-gray/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
