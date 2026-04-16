const trimmedBaseUrl = import.meta.env.VITE_PRODUCTION_BACKEND_URL?.replace(/\/$/, "") || "";

export const getApiUrl = (path) => {
  if (!path) return trimmedBaseUrl;
  if (/^https?:\/\//.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBaseUrl}${normalizedPath}`;
};
