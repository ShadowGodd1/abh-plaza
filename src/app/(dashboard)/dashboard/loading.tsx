export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-warm-gray/30 rounded" />
          <div className="h-4 w-32 bg-warm-gray/20 rounded" />
        </div>
        <div className="h-10 w-24 bg-warm-gray/20 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5">
            <div className="h-4 w-24 bg-warm-gray/20 rounded mb-3" />
            <div className="h-8 w-20 bg-warm-gray/30 rounded mb-2" />
            <div className="h-3 w-32 bg-warm-gray/20 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="h-5 w-32 bg-warm-gray/20 rounded mb-6" />
          <div className="h-64 bg-warm-gray/10 rounded-lg" />
        </div>
        <div className="card p-6">
          <div className="h-5 w-32 bg-warm-gray/20 rounded mb-6" />
          <div className="h-64 bg-warm-gray/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
