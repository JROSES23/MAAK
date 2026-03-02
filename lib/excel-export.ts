import * as XLSX from "xlsx";
import type { Pedido } from "./types";
import { formatCLP } from "./utils";

/**
 * Exporta un pedido completo a un archivo Excel descargable.
 */
interface ExcelRow {
  "#": number | string;
  Producto: string;
  Cantidad: number | string;
  Unidad: string;
  "Precio Est.": number | string;
  Subtotal: number;
  Sucursal: string;
}

export function exportPedidoToExcel(pedido: Pedido) {
  const rows: ExcelRow[] = pedido.items.map((item, idx) => ({
    "#": idx + 1,
    Producto: item.producto?.nombre || "\u2014",
    Cantidad: item.cantidad,
    Unidad: item.unidad,
    "Precio Est.": item.precio_estimado,
    Subtotal: item.cantidad * item.precio_estimado,
    Sucursal: item.sucursal?.nombre || "\u2014",
  }));

  // Fila de total
  rows.push({
    "#": "",
    Producto: "",
    Cantidad: "",
    Unidad: "",
    "Precio Est.": "TOTAL",
    Subtotal: pedido.total_estimado,
    Sucursal: "",
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Ajustar anchos de columna
  ws["!cols"] = [
    { wch: 4 },
    { wch: 30 },
    { wch: 10 },
    { wch: 8 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pedido");

  // Hoja de info del pedido
  const infoRows = [
    { Campo: "Proveedor", Valor: pedido.proveedor?.nombre || "—" },
    { Campo: "Sucursal", Valor: pedido.sucursal?.nombre || "—" },
    { Campo: "Fecha", Valor: pedido.fecha },
    { Campo: "Estado", Valor: pedido.estado },
    { Campo: "Total Estimado", Valor: formatCLP(pedido.total_estimado) },
    { Campo: "Notas", Valor: pedido.notas || "—" },
  ];
  const wsInfo = XLSX.utils.json_to_sheet(infoRows);
  wsInfo["!cols"] = [{ wch: 16 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Info");

  const filename = `Pedido_${pedido.proveedor?.nombre || "sin-proveedor"}_${pedido.fecha}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Genera texto formateado para enviar por WhatsApp.
 */
export function generateWhatsAppText(pedido: Pedido): string {
  const lines: string[] = [];

  lines.push(`*PEDIDO FERRETERIA MAAK*`);
  lines.push(`Proveedor: ${pedido.proveedor?.nombre || "—"}`);
  lines.push(`Sucursal: ${pedido.sucursal?.nombre || "—"}`);
  lines.push(`Fecha: ${pedido.fecha}`);
  lines.push("");
  lines.push("*Detalle:*");

  pedido.items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.producto?.nombre || "—"} — ${item.cantidad} ${item.unidad}`
    );
  });

  lines.push("");
  lines.push(`*Total estimado: ${formatCLP(pedido.total_estimado)}*`);

  if (pedido.notas) {
    lines.push("");
    lines.push(`Notas: ${pedido.notas}`);
  }

  return lines.join("\n");
}
