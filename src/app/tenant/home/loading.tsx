export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-48 bg-surface-2 rounded" />
      <div className="h-24 bg-surface-2 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-surface-2 rounded-lg" />
        <div className="h-20 bg-surface-2 rounded-lg" />
      </div>
      <div className="h-40 bg-surface-2 rounded-lg" />
    </div>
  );
}
