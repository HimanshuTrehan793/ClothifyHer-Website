import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

export interface LayoutProps {
  children: ReactNode;
}

export interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<LucideProps>;
}
