"use client";

import {
  Calendar,
  Wallet,
  Building2,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { formatCLP, formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  amount?: number;
  sucursal?: string;
  type: "quincena" | "sueldo" | "gasto_fijo" | "otro";
  importance: "normal" | "alta";
}

const eventsMock: UpcomingEvent[] = [
  {
    id: "e1",
    title: "Quincena - Casa Matriz",
    date: "2026-03-15",
    amount: 1250000,
    sucursal: "Casa Matriz",
    type: "quincena",
    importance: "alta",
  },
  {
    id: "e2",
    title: "Quincena - Sucursal Centro",
    date: "2026-03-15",
    amount: 720000,
    sucursal: "Sucursal Centro",
    type: "quincena",
    importance: "alta",
  },
  {
    id: "e3",
    title: "Arriendo Sucursal Norte",
    date: "2026-03-05",
    amount: 450000,
    sucursal: "Sucursal Norte",
    type: "gasto_fijo",
    importance: "normal",
  },
  {
    id: "e4",
    title: "Servicios basicos (3 sucursales)",
    date: "2026-03-10",
    amount: 285000,
    type: "gasto_fijo",
    importance: "normal",
  },
  {
    id: "e5",
    title: "Sueldos fin de mes",
    date: "2026-03-30",
    amount: 4590000,
    type: "sueldo",
    importance: "alta",
  },
];

const typeIcons = {
  quincena: Wallet,
  sueldo: CreditCard,
  gasto_fijo: Building2,
  otro: Calendar,
};

export function UpcomingEventsCard() {
  return (
    <div className="rounded-squircle border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
        Proximos pagos y eventos
      </h3>

      <div className="space-y-3">
        {eventsMock.map((event) => {
          const Icon = typeIcons[event.type];
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-xl bg-[var(--color-surface-alt)] p-3"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
                <Icon className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">
                    {event.title}
                  </p>
                  {event.importance === "alta" && (
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                  )}
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  {formatDateShort(event.date)}
                </p>
              </div>
              {event.amount && (
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {formatCLP(event.amount)}
                  </p>
                  <Badge variant="accent">
                    {event.type === "quincena"
                      ? "Quincena"
                      : event.type === "sueldo"
                      ? "Sueldo"
                      : "Gasto fijo"}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
