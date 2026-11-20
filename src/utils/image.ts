const MAX_EDGE = 1400;
const JPEG_QUALITY = 0.8;

export interface CompressedImage {
  src: string;
  width: number;
  height: number;
}

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // fall through to the <img> decoder
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => undefined };
  } catch {
    throw new Error('This image could not be read. Try a JPG, PNG or WebP file.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Resizes to at most 1400px on the long edge and re-encodes as JPEG, entirely in the browser. */
export async function compressImage(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image.');
  const decoded = await decode(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(decoded.width, decoded.height));
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Your browser cannot process images.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(decoded.source, 0, 0, width, height);
    return { src: canvas.toDataURL('image/jpeg', JPEG_QUALITY), width, height };
  } finally {
    decoded.release();
  }
}
