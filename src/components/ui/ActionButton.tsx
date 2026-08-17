// src/components/ui/ActionButton.tsx
type ActionButtonProps = {
  onClick: () => void;
  label: string;
  variant?: 'amber' | 'neutral';
};

export function ActionButton({ onClick, label, variant = 'amber' }: ActionButtonProps) {
  const baseClasses = "mt-4 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300";
  const variantClasses = variant === 'amber' 
    ? "text-amber-500/70 border-amber-500/20 hover:border-amber-400/50 hover:text-amber-300 hover:bg-amber-950/20"
    : "text-neutral-500/70 border-neutral-500/20 hover:border-neutral-400/50 hover:text-neutral-300 hover:bg-neutral-950/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {label}
    </button>
  );
}
