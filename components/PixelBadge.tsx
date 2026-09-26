type PixelBadgeProps = {
  children: React.ReactNode;
};

export function PixelBadge({ children }: PixelBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
      <span className="h-1.5 w-1.5 bg-emerald-300 shadow-[2px_2px_0_rgba(34,211,238,.35)]" />
      {children}
    </span>
  );
}
