export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-40 bg-surface-2 rounded" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-surface-2 rounded-lg" />
      ))}
    </div>
  );
}
