import { supabase } from '@/lib/supabase/client';
import { uploadToDrive } from '@/lib/drive/upload';

export type StoragePreference = 'supabase' | 'supabase_drive' | 'ask';

type UploadPathOptions = {
  sucursalId: string;
  proveedorId?: string;
  trabajadorId?: string;
  categoria?: string;
};

export async function compressImage(file: File, maxSize = 1280, quality = 0.68): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const imageBitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(imageBitmap.width, imageBitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imageBitmap.width * scale);
  canvas.height = Math.round(imageBitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) return file;

  context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
}

export async function prepareFile(file: File): Promise<File> {
  if (file.type === 'application/pdf') {
    // TODO: Integrar compresión PDF con backend worker (n8n, qpdf, iLovePDF API).
    return file;
  }

  return compressImage(file);
}

export async function uploadToSupabase(file: File, options: UploadPathOptions) {
  const extension = file.name.split('.').pop() ?? 'bin';
  const nestedEntity = options.proveedorId
    ? `proveedor/${options.proveedorId}`
    : options.trabajadorId
      ? `trabajador/${options.trabajadorId}`
      : `categoria/${options.categoria ?? 'general'}`;

  const path = `sucursal/${options.sucursalId}/${nestedEntity}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from('boletas').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) throw error;

  const { data } = supabase.storage.from('boletas').getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function uploadByPreference(
  file: File,
  preference: StoragePreference,
  uploadPathOptions: UploadPathOptions,
  driveMetadata?: { token?: string; folderPath: string }
) {
  const compressed = await prepareFile(file);
  const supabaseResult = await uploadToSupabase(compressed, uploadPathOptions);

  if (preference === 'supabase') {
    return { adjunto_local_path: supabaseResult.path, adjunto_drive_id: null };
  }

  if (preference === 'supabase_drive') {
    const driveResult = await uploadToDrive(compressed, {
      token: driveMetadata?.token,
      folderPath: driveMetadata?.folderPath ?? 'GestionPYME/General',
      fileName: compressed.name,
      mimeType: compressed.type
    });

    return { adjunto_local_path: supabaseResult.path, adjunto_drive_id: driveResult.fileId };
  }

  return { adjunto_local_path: supabaseResult.path, adjunto_drive_id: null };
}
