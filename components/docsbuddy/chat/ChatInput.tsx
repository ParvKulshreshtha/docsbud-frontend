import { SendIcon } from "../icons/SendIcon";

type ChatInputProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({
  value,
  loading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <div className="px-4 py-3 border-t border-border flex gap-2 items-center shrink-0 bg-surface">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void onSubmit();
          }
        }}
        placeholder="Ask about the document…"
        className="flex-1 px-3.5 py-2 text-sm rounded-card bg-surface-2 border border-border text-ink placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
      />
      <button
        onClick={() => void onSubmit()}
        disabled={loading || !value.trim()}
        className="w-9 h-9 flex items-center justify-center rounded-card bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        aria-label="Send"
      >
        <SendIcon />
      </button>
    </div>
  );
}
