export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() || '',
};

export const isCloudinaryConfigured = Boolean(cloudinaryConfig.cloudName);

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif';
}

export function buildCloudinaryUrl(
  publicIdOrUrl: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!publicIdOrUrl) return '';
  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
    return publicIdOrUrl;
  }
  if (!isCloudinaryConfigured) {
    return publicIdOrUrl;
  }

  const transforms = [
    `f_${options.format ?? 'auto'}`,
    `q_${options.quality ?? 'auto'}`,
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null,
  ]
    .filter(Boolean)
    .join(',');

  const cleanId = publicIdOrUrl.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${encodeURIComponent(cloudinaryConfig.cloudName)}/image/upload/${transforms}/${cleanId}`;
}

export async function uploadMediaToCloudinary(file: File): Promise<{
  ok: boolean;
  url?: string;
  error?: string;
}> {
  if (!isCloudinaryConfigured || !cloudinaryConfig.uploadPreset) {
    return {
      ok: false,
      error: 'Cloudinary media upload is not configured in this environment.',
    };
  }

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, error: 'File must be 10 MB or smaller.' };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinaryConfig.cloudName)}/auto/upload`,
      { method: 'POST', body: formData }
    );
    if (!response.ok) {
      return { ok: false, error: 'Media upload failed. Please verify upload preset permissions.' };
    }
    const payload = (await response.json()) as { secure_url?: string };
    return { ok: true, url: payload.secure_url };
  } catch {
    return { ok: false, error: 'Network error while uploading media.' };
  }
}
