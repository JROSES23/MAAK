import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para uso en el browser (Client Components).
 *
 * Requiere las variables de entorno:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Tablas necesarias en Supabase:
 *
 * -- sucursales: id, nombre, direccion, telefono, created_at
 * -- proveedores: id, nombre, rut, telefono, email, direccion, created_at
 * -- productos: id, nombre, unidad_default, categoria, created_at
 * -- pedidos: id, fecha, proveedor_id, sucursal_id, estado, notas, total_estimado, created_at
 * -- pedido_items: id, pedido_id, producto_id, cantidad, unidad, precio_estimado, sucursal_id
 * -- trabajadores: id, nombre, rut, rol, sucursal_id, fecha_ingreso, estado, sueldo_base, email, telefono, created_at
 * -- contratos: id, trabajador_id, tipo, fecha_inicio, fecha_fin, sueldo, created_at
 * -- pagos: id, trabajador_id, tipo (quincena/sueldo/bono), monto, fecha_pago, periodo, created_at
 * -- asistencias: id, trabajador_id, fecha, presente, notas, created_at
 * -- preferencias_trabajador: id, trabajador_id, pregunta, respuesta, created_at
 * -- planner_tasks: id, titulo, descripcion, fecha, prioridad, sucursal_id, completada, created_at
 * -- presupuesto_mensual: id, mes, anio, total, remuneraciones, pedidos, gastos_admin, otros, created_at
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  return createBrowserClient(url, key);
}
