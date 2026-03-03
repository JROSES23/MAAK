"use client";

import { useEffect } from "react";
import { IslandSidebar } from "@/components/layout/IslandSidebar";
import { createClient } from "@/lib/supabase/client";
import { useBranchesStore } from "@/store/useBranchesStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const setBranches = useBranchesStore((s) => s.setBranches);

  useEffect(() => {
    const loadBranches = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sucursales")
        .select("id, nombre, direccion, telefono, color, created_at")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setBranches(data);
      } else {
        // Fallback: si falla la carga, dejar vacío
        setBranches([]);
      }
    };

    loadBranches();
  }, [setBranches]);

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
