export type ChatMessage = {
  question: string;
  answer: string;
};

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export type UploadedDocument = {
  fileName: string;
  documentId?: string;
  chunksCount?: number;
};
