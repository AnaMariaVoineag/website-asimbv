import { API_BASE } from '../config';

export class ApiError extends Error {
  constructor(status) {
    super(`Eroare server: ${status}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const request = (path, options) => fetch(`${API_BASE}${path}`, options);

export const getJson = async (path, options) => {
  const response = await request(path, options);
  if (!response.ok) throw new ApiError(response.status);
  return response.json();
};

export const getJsonList = async (path, options) => {
  const response = await request(path, options);
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const postJson = (path, body) =>
  request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
