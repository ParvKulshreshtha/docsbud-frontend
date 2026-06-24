export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export type UploadedDocument = {
  fileName: string;
  documentId?: string;
  chunksCount?: number;
};
