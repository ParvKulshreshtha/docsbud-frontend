import type { RefObject } from "react";
import type { ConversationMessage, UploadedDocument } from "../types";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { ScrollToBottomButton } from "./ScrollToBottomButton";

type ChatPanelProps = {
  file: File | null;
  uploaded: UploadedDocument | null;
  messages: ConversationMessage[];
  question: string;
  loading: boolean;
  summaryLoading: boolean;
  showScrollToBottom: boolean;
  chatScrollRef: RefObject<HTMLDivElement | null>;
  onOpenSidebar: () => void;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
  onScroll: () => void;
  onScrollToBottom: () => void;
};

export function ChatPanel({
  file,
  uploaded,
  messages,
  question,
  loading,
  summaryLoading,
  showScrollToBottom,
  chatScrollRef,
  onOpenSidebar,
  onQuestionChange,
  onAsk,
  onScroll,
  onScrollToBottom,
}: ChatPanelProps) {
  return (
    <main className="flex-1 flex flex-col min-w-0 relative">
      <ChatHeader
        file={file}
        uploaded={uploaded}
        onOpenSidebar={onOpenSidebar}
      />

      <MessageList
        messages={messages}
        loading={loading}
        summaryLoading={summaryLoading}
        hasFile={!!file}
        scrollRef={chatScrollRef}
        onScroll={onScroll}
      />

      {showScrollToBottom && (
        <ScrollToBottomButton onClick={onScrollToBottom} />
      )}

      <ChatInput
        value={question}
        loading={loading || summaryLoading}
        onChange={onQuestionChange}
        onSubmit={onAsk}
      />
    </main>
  );
}
