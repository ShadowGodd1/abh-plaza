export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-surface-2 rounded" />
      <div className="h-6 w-64 bg-surface-2 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface-2 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
