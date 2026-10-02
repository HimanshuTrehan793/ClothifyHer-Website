import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { TopNavBar } from "@/components/navigation/TopNavBar";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import type { LayoutProps } from "@/interfaces/navigation";

export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="bg-cream-50 flex min-h-svh flex-col">
      {/* Above the sticky header so it scrolls away rather than pinning. */}
      <AnnouncementBar />
      <TopNavBar />

      <main className="flex-1">{children}</main>

      {/* Every page — support is the one thing people hunt for on any screen. */}
      <WhatsAppButton />
    </div>
  );
}
