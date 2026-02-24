import { createSupabaseClient } from '@/lib/supabase/client';

export async function compressBeforeUpload(file: File): Promise<File> {
  if (file.type.startsWith('image/')) {
    const img = await createImageBitmap(file);
    const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(img.width * scale);
    canvas.height = Math.floor(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.65));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
  }
  if (file.type === 'application/pdf') {
    // TODO: compresión PDF via backend o servicio externo
    return file;
  }
  return file;
}

type UploadParams = { tipo: 'pedido' | 'remuneracion' | 'gasto'; sucursalId?: string; proveedorId?: string; trabajadorId?: string; categoriaId?: string; userId?: string };

export async function uploadToSupabaseStorage(file: File, params: UploadParams): Promise<{ path: string }> {
  const supabase = createSupabaseClient();
  const folder = params.tipo === 'pedido'
    ? `pedidos/${params.sucursalId ?? 'sin-sucursal'}/${params.proveedorId ?? 'sin-proveedor'}`
    : params.tipo === 'remuneracion'
      ? `remuneraciones/${params.sucursalId ?? 'sin-sucursal'}/${params.trabajadorId ?? 'sin-trabajador'}`
      : `gastos/${params.userId ?? 'sin-user'}/${params.categoriaId ?? 'sin-categoria'}`;
  const path = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('boletas').upload(path, file, { upsert: false });
  if (error) throw error;
  return { path };
}

export async function uploadToGoogleDriveStub(_file: File, _metadata: Record<string, string>) {
  // TODO: implementar subida real con Google Drive API
  return { driveFileId: 'TODO-drive-id' };
}
