import { SidebarBody } from "./SidebarBody";
import { SidebarHeader } from "./SidebarHeader";
import type { ComponentProps } from "react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
} & ComponentProps<typeof SidebarBody>;

export function Sidebar({ open, onClose, ...bodyProps }: SidebarProps) {
  return (
    <aside
      className={[
        "fixed md:static z-30 inset-y-0 left-0 w-64 flex flex-col border-r border-border bg-surface shadow-lift md:shadow-none transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      ].join(" ")}
    >
      <SidebarHeader onClose={onClose} />
      <SidebarBody {...bodyProps} />
    </aside>
  );
}
