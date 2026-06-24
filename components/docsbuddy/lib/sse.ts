import { apiUrl } from "./api";
import type { ChatAskPayload } from "../types";

export type StreamChatHandlers = {
  onMetadata: () => void;
  onToken: (content: string) => void;
  onDone: (answer: string) => void;
  onError: (message: string) => void;
};

type SseEvent = {
  event: string;
  data: string;
};

function parseSseBlock(block: string): SseEvent | null {
  const lines = block.split("\n");
  let event = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}

async function* readSseEvents(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<SseEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const parsed = parseSseBlock(block.trim());
      if (parsed) yield parsed;
    }
  }

  const trailing = buffer.trim();
  if (trailing) {
    const parsed = parseSseBlock(trailing);
    if (parsed) yield parsed;
  }
}

function parseJsonData<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

export async function streamChatAsk(
  payload: ChatAskPayload,
  handlers: StreamChatHandlers
): Promise<void> {
  const response = await fetch(apiUrl("/chat/ask"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      ...payload,
      documentId: payload.documentId ?? undefined,
    }),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  for await (const { event, data } of readSseEvents(response.body)) {
    switch (event) {
      case "metadata": {
        handlers.onMetadata();
        break;
      }
      case "token": {
        const parsed = parseJsonData<{ content?: string }>(data);
        if (parsed.content) handlers.onToken(parsed.content);
        break;
      }
      case "done": {
        const parsed = parseJsonData<{ answer?: string }>(data);
        handlers.onDone(parsed.answer ?? "");
        break;
      }
      case "error": {
        const parsed = parseJsonData<{ message?: string }>(data);
        handlers.onError(parsed.message ?? "Request failed");
        return;
      }
      default:
        break;
    }
  }
}
