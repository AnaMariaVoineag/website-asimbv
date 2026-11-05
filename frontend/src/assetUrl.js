// Resolves a root-relative path from frontend/public against Vite's `base`,
// so assets load both locally and under the GitHub Pages subpath.
export const assetUrl = (path) =>
  path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
