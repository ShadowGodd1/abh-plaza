export default function PropertiesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-warm-gray/30 rounded" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-warm-gray/20 rounded-lg" />
          <div className="h-10 w-32 bg-warm-gray/20 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card overflow-hidden">
            <div className="h-32 bg-warm-gray/10" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-24 bg-warm-gray/20 rounded" />
              <div className="h-4 w-32 bg-warm-gray/10 rounded" />
              <div className="h-6 w-16 bg-warm-gray/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
