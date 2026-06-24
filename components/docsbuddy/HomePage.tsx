"use client";

import { ChatPanel } from "./chat/ChatPanel";
import { useDocsBuddy } from "./hooks/useDocsBuddy";
import { MobileSidebarOverlay } from "./layout/MobileSidebarOverlay";
import { Sidebar } from "./sidebar/Sidebar";

export function HomePage() {
  const {
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
  } = useDocsBuddy();

  return (
    <div className="h-screen flex bg-page text-ink">
      {sidebarOpen && (
        <MobileSidebarOverlay onClose={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        file={file}
        uploaded={uploaded}
        error={error}
        dragActive={dragActive}
        uploadLoading={uploadLoading}
        summaryLoading={summaryLoading}
        activeDocumentId={activeDocumentId}
        fileInputRef={fileInputRef}
        onDragActive={setDragActive}
        onPickFile={handlePickFile}
        onSummarize={() => void summarizePdf()}
      />

      <ChatPanel
        file={file}
        uploaded={uploaded}
        messages={messages}
        question={question}
        loading={loading}
        showScrollToBottom={showScrollToBottom}
        chatScrollRef={chatScrollRef}
        onOpenSidebar={() => setSidebarOpen(true)}
        onQuestionChange={setQuestion}
        onAsk={() => void askQuestion()}
        onScroll={updateScrollState}
        onScrollToBottom={scrollToBottom}
      />
    </div>
  );
}
