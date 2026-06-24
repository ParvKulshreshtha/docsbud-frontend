import type { UploadedDocument } from "../types";

type UploadStatusProps = {
  uploaded: UploadedDocument;
};

export function UploadStatus({ uploaded }: UploadStatusProps) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted">
      <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
      <span>ready</span>
      {typeof uploaded.chunksCount === "number" && (
        <span>· {uploaded.chunksCount} chunks</span>
      )}
    </div>
  );
}
