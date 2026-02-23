export type DriveUploadMetadata = {
  token?: string;
  folderPath: string;
  fileName: string;
  mimeType: string;
};

export async function uploadToDrive(file: Blob, metadata: DriveUploadMetadata) {
  if (!metadata.token) {
    throw new Error('Falta token OAuth de Google Drive. Configura NEXT_PUBLIC_GOOGLE_CLIENT_ID y flujo OAuth.');
  }

  const driveEndpoint = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  const boundary = '----gestionpyme-boundary';
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify({ name: metadata.fileName, parents: [] }) +
      `\r\n--${boundary}\r\nContent-Type: ${metadata.mimeType}\r\n\r\n`,
    file,
    `\r\n--${boundary}--`
  ]);

  const response = await fetch(driveEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${metadata.token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error subiendo a Drive: ${errorText}`);
  }

  const data = (await response.json()) as { id: string };
  return { fileId: data.id, folderPath: metadata.folderPath };
}
