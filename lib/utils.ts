import { type ClassValue, clsx } from "clsx";

/**
 * Merge Tailwind classes. Usa clsx para combinar.
 * (Nota: si se instala tailwind-merge, se puede usar cn = twMerge(clsx(...inputs)))
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formatea un número como moneda CLP.
 */
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea una fecha ISO a formato legible en español.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Formatea una fecha ISO a formato corto.
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
  }).format(date);
}

/**
 * Genera iniciales de un nombre (máx 2 letras).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Calcula porcentaje.
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
