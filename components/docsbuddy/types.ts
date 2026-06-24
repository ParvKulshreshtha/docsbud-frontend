export type ChatHistoryEntry = {
  question: string;
  answer: string;
};

/** @deprecated Use ChatHistoryEntry */
export type ChatMessage = ChatHistoryEntry;

export type ChatAskPayload = {
  question: string;
  userId: string;
  documentId: string | null;
  history: ChatHistoryEntry[];
};

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type UploadedDocument = {
  fileName: string;
  documentId?: string;
};
