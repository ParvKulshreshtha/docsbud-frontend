export function TypingIndicator() {
  return (
    <div className="self-start flex items-center gap-1 px-3.5 py-3 border border-border bg-surface rounded-card rounded-bl-sm">
      <span
        className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse_1.1s_ease-in-out_infinite]"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse_1.1s_ease-in-out_infinite]"
        style={{ animationDelay: "180ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse_1.1s_ease-in-out_infinite]"
        style={{ animationDelay: "360ms" }}
      />
    </div>
  );
}
