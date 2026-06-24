import { ListIcon } from "../icons/ListIcon";

type SummarizeButtonProps = {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export function SummarizeButton({
  loading,
  disabled,
  onClick,
}: SummarizeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-auto flex items-center gap-2 w-full px-3 py-2.5 rounded-card text-xs font-medium text-ink border border-border hover:border-accent/40 hover:bg-accent-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ListIcon className="text-accent" />
      {loading ? "Summarizing…" : "Summarize document"}
    </button>
  );
}
