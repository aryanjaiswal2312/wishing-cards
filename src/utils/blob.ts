export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unreadable file')));
    reader.onerror = () => reject(reader.error ?? new Error('Unreadable file'));
    reader.readAsDataURL(blob);
  });
}
