"use client";

import { IslandSidebar } from "@/components/layout/IslandSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <IslandSidebar />

      {/* Main content — offset for sidebar island */}
      <main className="flex-1 ml-[82px] overflow-y-auto min-h-screen">
        <div className="p-5 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
