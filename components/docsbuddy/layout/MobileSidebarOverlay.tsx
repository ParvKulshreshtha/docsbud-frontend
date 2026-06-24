type MobileSidebarOverlayProps = {
  onClose: () => void;
};

export function MobileSidebarOverlay({ onClose }: MobileSidebarOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-20 bg-ink/30 md:hidden"
      onClick={onClose}
    />
  );
}
