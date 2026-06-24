import { CloseIcon } from "../icons/CloseIcon";
import { Wordmark } from "./Wordmark";

type SidebarHeaderProps = {
  onClose: () => void;
};

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
      <Wordmark />
      <button
        onClick={onClose}
        className="md:hidden text-subtle hover:text-ink transition-colors"
        aria-label="Close sidebar"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
