import { Texture } from "pixi.js";

export function getImageElement(id) {
  const image = document.getElementById(id);

  if (!(image instanceof HTMLImageElement)) {
    throw new Error(`DOM image #${id} was not found`);
  }

  return image;
}

export function waitForImage(id) {
  const image = getImageElement(id);

  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve(image);
  }

  return new Promise((resolve, reject) => {
    const handleLoad = () => {
      cleanup();
      resolve(image);
    };
    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to load DOM image #${id}: ${image.src}`));
    };
    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });
}

export async function waitForImages(ids, onProgress) {
  let loadedAmount = 0;

  return Promise.all(
    ids.map(async (id) => {
      const image = await waitForImage(id);
      loadedAmount++;
      onProgress?.(loadedAmount / ids.length);
      return image;
    })
  );
}

export async function getDomTexture(id) {
  const image = await waitForImage(id);
  return Texture.from(image);
}
