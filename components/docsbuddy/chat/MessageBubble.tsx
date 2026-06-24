import type { ConversationMessage } from "../types";

type MessageBubbleProps = {
  message: ConversationMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={[
        "max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed",
        isUser
          ? "self-end bg-accent text-on-accent rounded-card rounded-br-sm shadow-soft"
          : "self-start bg-surface border border-border text-ink rounded-card rounded-bl-sm",
      ].join(" ")}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
}
