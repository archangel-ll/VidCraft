export function Progress({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-sky-400" style={{ width: `${pct}%` }} />
    </div>
  );
}