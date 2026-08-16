// src/lib/image.js

/**
 * Shrinks a picked image before it goes into localStorage.
 *
 * Full-size phone photos as base64 blow through the ~5 MB localStorage quota
 * after a handful of words, and the failure is silent. 256px WebP keeps a
 * custom-word tile crisp at roughly 10 KB.
 */
export function downscaleImage(file, { maxSize = 256, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Safari gained WebP encoding late; toDataURL falls back to PNG on its
        // own if the type is unsupported, which is fine.
        resolve(canvas.toDataURL('image/webp', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
