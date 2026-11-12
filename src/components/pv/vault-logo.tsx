export function VaultLogo({ className = "size-7" }: { className?: string }) {
  return (
    <div className={`grid place-items-center rounded-lg bg-primary text-primary-foreground ${className}`}>
      <svg viewBox="0 0 24 24" className="size-[60%]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
      </svg>
    </div>
  );
}
