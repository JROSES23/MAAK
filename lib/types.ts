export const USER_ID_DEMO = '00000000-0000-0000-0000-000000000001';

export type StoragePreference = 'supabase' | 'supabase+drive' | 'ask';

export type Sucursal = { id: string; nombre: string; direccion: string | null; created_at: string };
export type Proveedor = { id: string; nombre: string; contacto: string | null; created_at: string };
export type Trabajador = { id: string; nombre: string; rut: string | null; sucursal_id: string; created_at: string };

export type Pedido = {
  id: string; sucursal_id: string; proveedor_id: string; fecha_pedido: string; monto_estimado: number;
  estado: string; notas: string | null; datos_adicionales: string | null; adjunto_local_path: string | null;
  adjunto_drive_id: string | null; status_sync: string | null; created_at: string;
};

export type Remuneracion = {
  id: string; trabajador_id: string; fecha_pago: string; sueldo_base: number; bonos: number | null;
  es_quincena: boolean; datos_adicionales: string | null; adjunto_local_path: string | null;
  adjunto_drive_id: string | null; status_sync: string | null; created_at: string;
};

export type CategoriaPersonal = { id: string; user_id: string; nombre: string; created_at: string };
export type GastoPersonal = {
  id: string; user_id: string; categoria_id: string; monto: number; fecha: string; descripcion: string | null;
  datos_adicionales: string | null; adjunto_local_path: string | null; adjunto_drive_id: string | null;
  status_sync: string | null; created_at: string;
};

export type Notificacion = {
  id: string; user_id: string; tipo: string; titulo: string; mensaje: string; fecha_programada: string;
  leida: boolean; created_at: string;
};
