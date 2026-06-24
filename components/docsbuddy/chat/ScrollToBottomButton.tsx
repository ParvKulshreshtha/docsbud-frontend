type ScrollToBottomButtonProps = {
  onClick: () => void;
};

export function ScrollToBottomButton({ onClick }: ScrollToBottomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-20 right-5 text-xs text-ink border border-border bg-surface rounded-full px-3 py-1.5 shadow-lift hover:border-accent/40 hover:text-accent transition-colors"
    >
      ↓ scroll down
    </button>
  );
}
