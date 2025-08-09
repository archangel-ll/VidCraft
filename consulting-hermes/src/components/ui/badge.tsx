import { cn } from "./cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-sky-400 px-2.5 py-1 text-xs font-medium text-white", className)}>
      {children}
    </span>
  );
}