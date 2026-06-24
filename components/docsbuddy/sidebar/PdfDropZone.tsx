import type { RefObject } from "react";
import { UploadIcon } from "../icons/UploadIcon";

type PdfDropZoneProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  dragActive: boolean;
  uploadLoading: boolean;
  onDragActive: (active: boolean) => void;
  onPickFile: (file: File | null | undefined) => void;
};

export function PdfDropZone({
  fileInputRef,
  dragActive,
  uploadLoading,
  onDragActive,
  onPickFile,
}: PdfDropZoneProps) {
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragActive(false);
        void onPickFile(e.dataTransfer.files?.[0]);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
      }}
      className={[
        "border border-dashed rounded-card p-5 flex flex-col items-center gap-2 text-center cursor-pointer transition-colors",
        dragActive
          ? "border-accent bg-accent-soft"
          : "border-border hover:border-accent/60 hover:bg-surface-2",
        uploadLoading ? "pointer-events-none opacity-70" : "",
      ].join(" ")}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => void onPickFile(e.target.files?.[0])}
      />

      <UploadIcon className="text-accent" />

      <div>
        <p className="text-sm font-medium text-ink">
          {uploadLoading ? "Uploading…" : "Drop a PDF here"}
        </p>
        <p className="text-xs text-muted mt-0.5">or click to browse</p>
      </div>

      <span className="inline-flex items-center gap-1 text-[11px] text-muted border border-border rounded-full px-2.5 py-0.5">
        PDF only
      </span>
    </div>
  );
}
