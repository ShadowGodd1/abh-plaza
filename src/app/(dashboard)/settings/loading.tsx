export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-surface-2 rounded" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-40 bg-surface-2 rounded-lg" />
      ))}
    </div>
  );
}
