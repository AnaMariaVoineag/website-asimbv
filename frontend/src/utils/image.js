import { assetUrl } from './assetUrl';

export const FALLBACK_IMAGE = '/logo_asimbv_circle.png';

// onError handler for <img>: swaps a broken image for the association logo, once.
export const handleImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = assetUrl(FALLBACK_IMAGE);
};
