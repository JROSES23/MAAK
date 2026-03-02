/* ==========================================================
   Tipos principales del sistema MAAK
   Cada tipo corresponde a una tabla sugerida en Supabase.
   ========================================================== */

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  unidad_default: string; // ej: "kg", "un", "mt", "bolsa"
  categoria: string;
}

export type EstadoPedido = "borrador" | "pendiente" | "enviado" | "recibido" | "cancelado";

export interface Pedido {
  id: string;
  fecha: string; // ISO date
  proveedor_id: string;
  proveedor?: Proveedor;
  sucursal_id: string;
  sucursal?: Sucursal;
  estado: EstadoPedido;
  notas: string;
  total_estimado: number;
  items: PedidoItem[];
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  producto_id: string;
  producto?: Producto;
  cantidad: number;
  unidad: string;
  precio_estimado: number;
  sucursal_id: string;
  sucursal?: Sucursal;
}

export type EstadoTrabajador = "activo" | "inactivo";
export type RolTrabajador = "vendedor" | "bodeguero" | "cajero" | "jefe_sucursal" | "administrador" | "auxiliar";

export interface Trabajador {
  id: string;
  nombre: string;
  rut: string;
  rol: RolTrabajador;
  sucursal_id: string;
  sucursal?: Sucursal;
  fecha_ingreso: string;
  estado: EstadoTrabajador;
  sueldo_base: number;
  email: string;
  telefono: string;
}

export interface Contrato {
  id: string;
  trabajador_id: string;
  tipo: "plazo_fijo" | "indefinido" | "honorarios";
  fecha_inicio: string;
  fecha_fin?: string;
  sueldo: number;
}

export type TipoPago = "quincena" | "sueldo" | "bono" | "descuento";

export interface Pago {
  id: string;
  trabajador_id: string;
  tipo: TipoPago;
  monto: number;
  fecha_pago: string;
  periodo: string; // ej: "2026-03"
}

export interface Asistencia {
  id: string;
  trabajador_id: string;
  fecha: string;
  presente: boolean;
  notas: string;
}

export interface PreferenciaTrabajador {
  id: string;
  trabajador_id: string;
  pregunta: string;
  respuesta: string;
}

export type Prioridad = "baja" | "media" | "alta" | "urgente";

export interface PlannerTask {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  prioridad: Prioridad;
  sucursal_id?: string;
  sucursal?: Sucursal;
  completada: boolean;
}

export interface PresupuestoMensual {
  id: string;
  mes: number;
  anio: number;
  total: number;
  remuneraciones: number;
  pedidos: number;
  gastos_admin: number;
  otros: number;
}
