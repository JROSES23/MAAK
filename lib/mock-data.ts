import type {
  Sucursal,
  Proveedor,
  Producto,
  Pedido,
  Trabajador,
  PlannerTask,
  PresupuestoMensual,
  Pago,
} from "./types";

/* ==========================================================
   DATOS MOCK — Ferretería MAAK
   ========================================================== */

export const sucursales: Sucursal[] = [
  { id: "s1", nombre: "Casa Matriz", direccion: "Av. Principal 1234", telefono: "+56 9 1234 5678", color: "#f4a7bb" },
  { id: "s2", nombre: "Sucursal Centro", direccion: "Calle Comercio 567", telefono: "+56 9 2345 6789", color: "#98d4bb" },
  { id: "s3", nombre: "Sucursal Norte", direccion: "Av. Norte 890", telefono: "+56 9 3456 7890", color: "#c3a6d8" },
];

export const proveedores: Proveedor[] = [
  { id: "p1", nombre: "Cementos del Sur", rut: "76.123.456-7", telefono: "+56 9 5551234", email: "ventas@cementossur.cl", direccion: "Zona Industrial 100" },
  { id: "p2", nombre: "Maderas Nativas SpA", rut: "76.234.567-8", telefono: "+56 9 5552345", email: "contacto@maderasnativas.cl", direccion: "Ruta 5 Km 42" },
  { id: "p3", nombre: "Tornillos y Fijaciones Ltda", rut: "76.345.678-9", telefono: "+56 9 5553456", email: "pedidos@tornillosfij.cl", direccion: "Parque Industrial Norte" },
  { id: "p4", nombre: "Pinturas Color Plus", rut: "76.456.789-0", telefono: "+56 9 5554567", email: "ventas@colorplus.cl", direccion: "Av. Las Industrias 2500" },
  { id: "p5", nombre: "Distribuidora Ferretera Nacional", rut: "76.567.890-1", telefono: "+56 9 5555678", email: "ventas@dfnacional.cl", direccion: "Calle Bodega 34" },
];

export const productos: Producto[] = [
  { id: "prod1", nombre: "Cemento Polpaico 25kg", unidad_default: "bolsa", categoria: "Construcción" },
  { id: "prod2", nombre: "Tabla Pino 2x4 (3.2m)", unidad_default: "un", categoria: "Maderas" },
  { id: "prod3", nombre: "Tornillo Madera 2\"", unidad_default: "caja", categoria: "Fijaciones" },
  { id: "prod4", nombre: "Pintura Látex Blanco 4L", unidad_default: "un", categoria: "Pinturas" },
  { id: "prod5", nombre: "Fierro Estriado 8mm (6m)", unidad_default: "barra", categoria: "Construcción" },
  { id: "prod6", nombre: "Arena Gruesa", unidad_default: "m³", categoria: "Construcción" },
  { id: "prod7", nombre: "Grava 3/4\"", unidad_default: "m³", categoria: "Construcción" },
  { id: "prod8", nombre: "Clavo 3\"", unidad_default: "kg", categoria: "Fijaciones" },
  { id: "prod9", nombre: "Lija al Agua #120", unidad_default: "pliego", categoria: "Acabados" },
  { id: "prod10", nombre: "Tubo PVC 110mm (3m)", unidad_default: "un", categoria: "Gasfitería" },
  { id: "prod11", nombre: "Codo PVC 90° 110mm", unidad_default: "un", categoria: "Gasfitería" },
  { id: "prod12", nombre: "Pegamento PVC 240cc", unidad_default: "un", categoria: "Gasfitería" },
];

export const pedidosMock: Pedido[] = [
  {
    id: "ped1",
    fecha: "2026-03-01",
    proveedor_id: "p1",
    proveedor: proveedores[0],
    sucursal_id: "s1",
    sucursal: sucursales[0],
    estado: "enviado",
    notas: "Urgente para obra calle Los Olmos",
    total_estimado: 485000,
    items: [
      { id: "pi1", pedido_id: "ped1", producto_id: "prod1", producto: productos[0], cantidad: 50, unidad: "bolsa", precio_estimado: 6500, sucursal_id: "s1" },
      { id: "pi2", pedido_id: "ped1", producto_id: "prod6", producto: productos[5], cantidad: 3, unidad: "m³", precio_estimado: 45000, sucursal_id: "s1" },
      { id: "pi3", pedido_id: "ped1", producto_id: "prod5", producto: productos[4], cantidad: 20, unidad: "barra", precio_estimado: 5500, sucursal_id: "s1" },
    ],
  },
  {
    id: "ped2",
    fecha: "2026-02-28",
    proveedor_id: "p2",
    sucursal_id: "s2",
    proveedor: proveedores[1],
    sucursal: sucursales[1],
    estado: "borrador",
    notas: "",
    total_estimado: 320000,
    items: [
      { id: "pi4", pedido_id: "ped2", producto_id: "prod2", producto: productos[1], cantidad: 80, unidad: "un", precio_estimado: 4000, sucursal_id: "s2" },
    ],
  },
  {
    id: "ped3",
    fecha: "2026-02-25",
    proveedor_id: "p3",
    sucursal_id: "s3",
    proveedor: proveedores[2],
    sucursal: sucursales[2],
    estado: "recibido",
    notas: "Pedido mensual regular",
    total_estimado: 156000,
    items: [
      { id: "pi5", pedido_id: "ped3", producto_id: "prod3", producto: productos[2], cantidad: 30, unidad: "caja", precio_estimado: 3800, sucursal_id: "s3" },
      { id: "pi6", pedido_id: "ped3", producto_id: "prod8", producto: productos[7], cantidad: 10, unidad: "kg", precio_estimado: 4200, sucursal_id: "s3" },
    ],
  },
];

export const trabajadoresMock: Trabajador[] = [
  { id: "t1", nombre: "María González Soto", rut: "12.345.678-9", rol: "jefe_sucursal", sucursal_id: "s1", fecha_ingreso: "2020-03-15", estado: "activo", sueldo_base: 850000, email: "maria@maak.cl", telefono: "+56 9 1111 2222" },
  { id: "t2", nombre: "Carlos Muñoz Pérez", rut: "13.456.789-0", rol: "vendedor", sucursal_id: "s1", fecha_ingreso: "2021-07-01", estado: "activo", sueldo_base: 520000, email: "carlos@maak.cl", telefono: "+56 9 2222 3333" },
  { id: "t3", nombre: "Ana Fuentes Rojas", rut: "14.567.890-1", rol: "cajero", sucursal_id: "s2", fecha_ingreso: "2022-01-10", estado: "activo", sueldo_base: 480000, email: "ana@maak.cl", telefono: "+56 9 3333 4444" },
  { id: "t4", nombre: "Pedro Sánchez López", rut: "15.678.901-2", rol: "bodeguero", sucursal_id: "s2", fecha_ingreso: "2021-11-20", estado: "activo", sueldo_base: 500000, email: "pedro@maak.cl", telefono: "+56 9 4444 5555" },
  { id: "t5", nombre: "Lucía Herrera Díaz", rut: "16.789.012-3", rol: "vendedor", sucursal_id: "s3", fecha_ingreso: "2023-04-05", estado: "activo", sueldo_base: 520000, email: "lucia@maak.cl", telefono: "+56 9 5555 6666" },
  { id: "t6", nombre: "Roberto Vega Mora", rut: "17.890.123-4", rol: "auxiliar", sucursal_id: "s3", fecha_ingreso: "2024-08-12", estado: "activo", sueldo_base: 420000, email: "roberto@maak.cl", telefono: "+56 9 6666 7777" },
  { id: "t7", nombre: "Daniela Ortiz Campos", rut: "18.901.234-5", rol: "jefe_sucursal", sucursal_id: "s2", fecha_ingreso: "2019-06-01", estado: "activo", sueldo_base: 820000, email: "daniela@maak.cl", telefono: "+56 9 7777 8888" },
  { id: "t8", nombre: "Felipe Araya Torres", rut: "19.012.345-6", rol: "vendedor", sucursal_id: "s1", fecha_ingreso: "2025-01-15", estado: "inactivo", sueldo_base: 480000, email: "felipe@maak.cl", telefono: "+56 9 8888 9999" },
];

export const pagosMock: Pago[] = [
  { id: "pay1", trabajador_id: "t1", tipo: "quincena", monto: 425000, fecha_pago: "2026-03-15", periodo: "2026-03" },
  { id: "pay2", trabajador_id: "t2", tipo: "quincena", monto: 260000, fecha_pago: "2026-03-15", periodo: "2026-03" },
  { id: "pay3", trabajador_id: "t3", tipo: "quincena", monto: 240000, fecha_pago: "2026-03-15", periodo: "2026-03" },
  { id: "pay4", trabajador_id: "t1", tipo: "sueldo", monto: 850000, fecha_pago: "2026-03-30", periodo: "2026-03" },
  { id: "pay5", trabajador_id: "t2", tipo: "sueldo", monto: 520000, fecha_pago: "2026-03-30", periodo: "2026-03" },
];

export const plannerTasksMock: PlannerTask[] = [
  { id: "task1", titulo: "Preparar pedido Sucursal Centro", descripcion: "Revisar inventario y generar pedido mensual de materiales básicos", fecha: "2026-03-01", prioridad: "alta", sucursal_id: "s2", completada: false },
  { id: "task2", titulo: "Revisar sueldos del mes", descripcion: "Calcular quincenas y verificar horas extra", fecha: "2026-03-10", prioridad: "alta", sucursal_id: undefined, completada: false },
  { id: "task3", titulo: "Pagar arriendo Sucursal Norte", descripcion: "Transferencia arriendo local comercial", fecha: "2026-03-05", prioridad: "urgente", sucursal_id: "s3", completada: false },
  { id: "task4", titulo: "Inventario trimestral Casa Matriz", descripcion: "Conteo físico de bodega principal", fecha: "2026-03-15", prioridad: "media", sucursal_id: "s1", completada: false },
  { id: "task5", titulo: "Reunión con proveedor de pinturas", descripcion: "Negociar precios para Q2", fecha: "2026-03-08", prioridad: "media", sucursal_id: undefined, completada: true },
  { id: "task6", titulo: "Actualizar catálogo de productos", descripcion: "Agregar nuevos productos de gasfitería al sistema", fecha: "2026-02-28", prioridad: "baja", sucursal_id: undefined, completada: false },
  { id: "task7", titulo: "Capacitación equipo ventas", descripcion: "Taller sobre nuevos productos de construcción", fecha: "2026-03-20", prioridad: "media", sucursal_id: "s1", completada: false },
  { id: "task8", titulo: "Pagar servicios básicos", descripcion: "Agua, luz y gas de las 3 sucursales", fecha: "2026-03-03", prioridad: "alta", sucursal_id: undefined, completada: true },
];

export const presupuestoMock: PresupuestoMensual = {
  id: "budget1",
  mes: 3,
  anio: 2026,
  total: 8500000,
  remuneraciones: 4590000,
  pedidos: 2200000,
  gastos_admin: 1200000,
  otros: 510000,
};
