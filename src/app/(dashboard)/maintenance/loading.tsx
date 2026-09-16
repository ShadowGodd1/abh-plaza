export default function MaintenanceLoading() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-warm-gray/20 rounded" />
              <div className="h-6 w-16 bg-warm-gray/20 rounded-full" />
            </div>
            <div className="h-4 w-full bg-warm-gray/10 rounded" />
            <div className="h-4 w-3/4 bg-warm-gray/10 rounded" />
            <div className="flex gap-4">
              <div className="h-3 w-20 bg-warm-gray/10 rounded" />
              <div className="h-3 w-24 bg-warm-gray/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
