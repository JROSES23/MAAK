import { BottomTabs } from '@/components/layout/BottomTabs';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 pb-28 pt-4 md:px-8">
      <main className="mx-auto max-w-6xl">{children}</main>
      <BottomTabs />
    </div>
  );
}
