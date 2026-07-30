import { TopNavBar } from "@/components/navigation/TopNavBar";
import { BottomNavBar } from "@/components/navigation/BottomNavBar";
import type { LayoutProps } from "@/interfaces/navigation";

interface MainLayoutProps extends LayoutProps {
  bagCount?: number;
}

export function MainLayout({ children, bagCount }: MainLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-stone-50">
      <TopNavBar bagCount={bagCount} />

      {/* pb clears the fixed mobile tab bar; it collapses at lg. */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>

      <BottomNavBar />
    </div>
  );
}
