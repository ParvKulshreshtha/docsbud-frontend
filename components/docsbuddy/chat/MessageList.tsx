import type { RefObject } from "react";
import type { ConversationMessage } from "../types";
import { ChatEmptyState } from "./ChatEmptyState";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

type MessageListProps = {
  messages: ConversationMessage[];
  loading: boolean;
  summaryLoading: boolean;
  hasFile: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

export function MessageList({
  messages,
  loading,
  summaryLoading,
  hasFile,
  scrollRef,
  onScroll,
}: MessageListProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 bg-page"
    >
      {messages.length === 0 && !loading && !summaryLoading && (
        <ChatEmptyState hasFile={hasFile} />
      )}

      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}

      {(loading || summaryLoading) && <TypingIndicator />}
    </div>
  );
}
