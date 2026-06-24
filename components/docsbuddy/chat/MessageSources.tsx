type MessageSourcesProps = {
  sources: string[];
};

export function MessageSources({ sources }: MessageSourcesProps) {
  return (
    <div className="mt-2.5 flex flex-col gap-1">
      {sources.map((source, i) => (
        <p
          key={i}
          className="text-[11px] text-muted flex items-baseline gap-1.5"
        >
          <span className="inline-block w-1 h-1 rounded-full bg-accent-2 shrink-0 mt-1.5" />
          {source}
        </p>
      ))}
    </div>
  );
}
