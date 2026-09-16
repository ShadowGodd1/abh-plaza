export default function AnnouncementsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-warm-gray/30 rounded" />
        <div className="h-10 w-40 bg-warm-gray/20 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 bg-warm-gray/20 rounded" />
              <div className="h-4 w-24 bg-warm-gray/10 rounded" />
            </div>
            <div className="h-4 w-full bg-warm-gray/10 rounded" />
            <div className="h-4 w-3/4 bg-warm-gray/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
