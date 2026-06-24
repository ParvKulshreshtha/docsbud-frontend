"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { getErrorMessage } from "../lib/errors";
import { apiUrl } from "../lib/api";
import { streamChatAsk } from "../lib/sse";
import type {
  ChatHistoryEntry,
  ConversationMessage,
  UploadedDocument,
} from "../types";

export function useDocsBuddy() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedDocument | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);
  const forceAutoScrollRef = useRef(false);
  const historyRef = useRef(history);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const activeDocumentId = useMemo(() => {
    return uploaded?.documentId ?? null;
  }, [uploaded?.documentId]);

  const scrollChatToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  const updateScrollState = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 32;
    isAtBottomRef.current = atBottom;
    setShowScrollToBottom(!atBottom);
  };

  useEffect(() => {
    if (forceAutoScrollRef.current || isAtBottomRef.current) {
      scrollChatToBottom("auto");
      forceAutoScrollRef.current = false;
    }
    updateScrollState();
  }, [messages, loading]);

  const clearSession = () => {
    setHistory([]);
    setMessages([]);
  };

  const uploadPdf = async (selectedFile: File) => {
    try {
      setUploadLoading(true);
      setError("");
      setUploaded(null);
      clearSession();

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(
        apiUrl("/document/upload"),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const documentId =
        res.data?.documentId ??
        res.data?.document_id ??
        res.data?.id ??
        res.data?.document?.id;

      setUploaded({
        fileName: selectedFile.name,
        documentId:
          typeof documentId === "string" && documentId.length > 0
            ? documentId
            : undefined,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const handlePickFile = async (pickedFile: File | null | undefined) => {
    if (!pickedFile) return;
    if (pickedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(pickedFile);
    await uploadPdf(pickedFile);
  };

  const streamQuestion = async (
    currentQuestion: string,
    userId: string,
    options: {
      showUserMessage: boolean;
      setStreaming: (streaming: boolean) => void;
    }
  ) => {
    const assistantIndexRef = { current: -1 };
    let streamedAnswer = "";

    options.setStreaming(true);
    setError("");

    if (options.showUserMessage) {
      forceAutoScrollRef.current = true;
      setMessages((prev) => [
        ...prev,
        { role: "user", content: currentQuestion },
      ]);
    }

    try {
      await streamChatAsk(
        {
          question: currentQuestion,
          userId,
          documentId: activeDocumentId,
          history: historyRef.current.slice(-2),
        },
        {
          onMetadata: () => {
            options.setStreaming(false);
            setMessages((prev) => {
              assistantIndexRef.current = prev.length;
              return [
                ...prev,
                {
                  role: "assistant",
                  content: "",
                },
              ];
            });
          },
          onToken: (token) => {
            streamedAnswer += token;
            setMessages((prev) => {
              const idx = assistantIndexRef.current;
              if (idx < 0 || idx >= prev.length) return prev;

              const next = [...prev];
              const current = next[idx];
              next[idx] = {
                ...current,
                content: current.content + token,
              };
              return next;
            });
          },
          onDone: (answer) => {
            const finalAnswer = answer || streamedAnswer;
            setMessages((prev) => {
              const idx = assistantIndexRef.current;
              if (idx < 0 || idx >= prev.length) return prev;

              const next = [...prev];
              next[idx] = { ...next[idx], content: finalAnswer };
              return next;
            });
            setHistory((prev) => [
              ...prev,
              { question: currentQuestion, answer: finalAnswer },
            ]);
          },
          onError: (message) => {
            setError(message);
            setMessages((prev) => {
              const idx = assistantIndexRef.current;
              if (idx < 0 || idx >= prev.length) return prev;
              if (!prev[idx].content) {
                return prev.filter((_, i) => i !== idx);
              }
              return prev;
            });
          },
        }
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to get answer");
      setMessages((prev) => {
        const idx = assistantIndexRef.current;
        if (idx < 0 || idx >= prev.length) return prev;
        if (!prev[idx].content) {
          return prev.filter((_, i) => i !== idx);
        }
        return prev;
      });
    } finally {
      options.setStreaming(false);
    }
  };

  const askQuestion = async () => {
    const currentQuestion = question.trim();
    if (!currentQuestion) return;

    setQuestion("");
    await streamQuestion(currentQuestion, "user-123", {
      showUserMessage: true,
      setStreaming: setLoading,
    });
  };

  const summarizePdf = async () => {
    if (!activeDocumentId) {
      setError("Upload a PDF first.");
      return;
    }

    await streamQuestion(
      "Summarize this document in simple points",
      "demo-user",
      {
        showUserMessage: false,
        setStreaming: setSummaryLoading,
      }
    );
  };

  const scrollToBottom = () => {
    forceAutoScrollRef.current = true;
    scrollChatToBottom();
  };

  return {
    file,
    question,
    setQuestion,
    loading,
    uploadLoading,
    summaryLoading,
    dragActive,
    setDragActive,
    uploaded,
    showScrollToBottom,
    sidebarOpen,
    setSidebarOpen,
    messages,
    error,
    fileInputRef,
    chatScrollRef,
    activeDocumentId,
    handlePickFile,
    askQuestion,
    summarizePdf,
    updateScrollState,
    scrollToBottom,
  };
}
