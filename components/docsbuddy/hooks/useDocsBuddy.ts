"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { getErrorMessage } from "../lib/errors";
import type { ChatMessage, ConversationMessage, UploadedDocument } from "../types";

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
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);
  const forceAutoScrollRef = useRef(false);

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
  }, [messages.length, loading]);

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
        "http://localhost:8001/document/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const chunksCount =
        res.data?.chunksCount ??
        res.data?.chunks_count ??
        res.data?.chunks?.length;

      const documentId =
        res.data?.documentId ??
        res.data?.document_id ??
        res.data?.id ??
        res.data?.document?.id;

      setUploaded({
        fileName: selectedFile.name,
        chunksCount: typeof chunksCount === "number" ? chunksCount : undefined,
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

  const askQuestion = async () => {
    const currentQuestion = question.trim();
    if (!currentQuestion) return;

    try {
      setLoading(true);
      setError("");
      setQuestion("");

      const userMsg: ConversationMessage = {
        role: "user",
        content: currentQuestion,
      };
      forceAutoScrollRef.current = true;
      setMessages((prev) => [...prev, userMsg]);

      const res = await axios.post("http://localhost:8001/chat/ask", {
        question: currentQuestion,
        userId: "user-123",
        documentId: activeDocumentId,
        history: history.slice(-2),
      });

      const answer = String(res.data?.answer ?? "");

      const sources = Array.isArray(res.data?.sources)
        ? (res.data.sources as unknown[]).map((s) => String(s))
        : undefined;

      const aiMsg: ConversationMessage = {
        role: "assistant",
        content: answer,
        sources,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer },
      ]);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  const summarizePdf = async () => {
    if (!activeDocumentId) {
      setError("Upload a PDF first.");
      return;
    }

    try {
      setSummaryLoading(true);
      setError("");

      const summaryQuestion = "Summarize this document in simple points";

      const res = await axios.post("http://localhost:8001/chat/ask", {
        question: summaryQuestion,
        userId: "demo-user",
        documentId: activeDocumentId,
        history: history.slice(-2),
      });

      const answer = String(res.data?.answer ?? "");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
      setHistory((prev) => [
        ...prev,
        { question: summaryQuestion, answer },
      ]);
    } catch {
      setError("Summary failed");
    } finally {
      setSummaryLoading(false);
    }
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
