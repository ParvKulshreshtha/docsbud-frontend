import { FileIcon } from "../icons/FileIcon";

type ChatEmptyStateProps = {
  hasFile: boolean;
};

export function ChatEmptyState({ hasFile }: ChatEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-16">
      <FileIcon size={28} className="text-border-strong" />
      <p className="text-sm text-muted">
        {hasFile
          ? "Ask anything about your document"
          : "Upload a PDF to get started"}
      </p>
    </div>
  );
}
