import { FileIcon } from "../icons/FileIcon";
import { MenuIcon } from "../icons/MenuIcon";
import type { UploadedDocument } from "../types";

type ChatHeaderProps = {
  file: File | null;
  uploaded: UploadedDocument | null;
  onOpenSidebar: () => void;
};

export function ChatHeader({ file, uploaded, onOpenSidebar }: ChatHeaderProps) {
  return (
    <header className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0 bg-surface">
      <button
        onClick={onOpenSidebar}
        className="md:hidden text-subtle hover:text-accent transition-colors"
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <FileIcon size={14} className="text-accent shrink-0" />
        <span className="text-sm font-medium text-ink truncate">
          {file ? file.name : "No document loaded"}
        </span>
      </div>

      {uploaded && (
        <span className="ml-auto shrink-0 text-[11px] text-muted">ready</span>
      )}
    </header>
  );
}
