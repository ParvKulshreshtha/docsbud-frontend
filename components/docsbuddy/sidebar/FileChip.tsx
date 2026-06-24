import { FileIcon } from "../icons/FileIcon";

type FileChipProps = {
  file: File;
};

export function FileChip({ file }: FileChipProps) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-card bg-surface-2 border border-border">
      <FileIcon className="text-accent shrink-0" />
      <span className="text-xs text-ink flex-1 truncate">{file.name}</span>
      <span className="text-[11px] text-muted shrink-0">
        {Math.max(1, Math.round(file.size / 1024))} KB
      </span>
    </div>
  );
}
