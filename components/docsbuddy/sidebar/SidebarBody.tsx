import type { RefObject } from "react";
import type { UploadedDocument } from "../types";
import { ErrorBanner } from "./ErrorBanner";
import { FileChip } from "./FileChip";
import { PdfDropZone } from "./PdfDropZone";
import { SummarizeButton } from "./SummarizeButton";
import { UploadStatus } from "./UploadStatus";

type SidebarBodyProps = {
  file: File | null;
  uploaded: UploadedDocument | null;
  error: string;
  dragActive: boolean;
  uploadLoading: boolean;
  summaryLoading: boolean;
  activeDocumentId: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragActive: (active: boolean) => void;
  onPickFile: (file: File | null | undefined) => void;
  onSummarize: () => void;
};

export function SidebarBody({
  file,
  uploaded,
  error,
  dragActive,
  uploadLoading,
  summaryLoading,
  activeDocumentId,
  fileInputRef,
  onDragActive,
  onPickFile,
  onSummarize,
}: SidebarBodyProps) {
  return (
    <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">
      <PdfDropZone
        fileInputRef={fileInputRef}
        dragActive={dragActive}
        uploadLoading={uploadLoading}
        onDragActive={onDragActive}
        onPickFile={onPickFile}
      />

      {file && <FileChip file={file} />}
      {uploaded && <UploadStatus />}
      {error && <ErrorBanner message={error} />}

      <SummarizeButton
        loading={summaryLoading}
        disabled={summaryLoading || uploadLoading || !activeDocumentId}
        onClick={onSummarize}
      />
    </div>
  );
}
