import { API_BASE } from '../config';

// The session ({ token, email, expiresAt }) lives in sessionStorage: it is forgotten when the tab is
// closed, and the server rejects the token after 12 hours or when the admin password changes.
const SESSION_STORAGE = 'asimbv-admin-session';

export const readSession = () => {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    if (!session?.token || new Date(session.expiresAt) <= new Date()) return null;
    return session;
  } catch {
    return null;
  }
};

export const storeSession = (session) => {
  try {
    sessionStorage.setItem(SESSION_STORAGE, JSON.stringify(session));
  } catch {
    // Storage unavailable (private mode): the session just won't survive a reload.
  }
};

export const forgetSession = () => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE);
  } catch {
    // Nothing stored.
  }
};

export class AdminApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

// Called when a request made with the stored key is rejected, so the dashboard can sign out.
let unauthorizedHandler = null;
export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
};

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

// `anonymous` requests (the login itself) carry no token and never trigger the sign-out handler.
const call = async (path, { method = 'GET', body, form, anonymous = false } = {}) => {
  const headers = {};
  const token = anonymous ? null : readSession()?.token;
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
  } catch {
    throw new AdminApiError(0, 'Serverul nu răspunde. Verifică conexiunea și încearcă din nou.');
  }

  const text = await response.text();
  const data = text ? parseJson(text) : null;

  if (response.status === 401) {
    if (!anonymous) unauthorizedHandler?.();
    throw new AdminApiError(401, data?.message || 'Sesiunea a expirat. Autentifică-te din nou.');
  }
  if (!response.ok) {
    throw new AdminApiError(response.status, data?.message || `Eroare server (${response.status}).`);
  }
  return data;
};

const json = (method, body) => ({ method, body });

export const adminApi = {
  // Resolves to { token, email, expiresAt }.
  login: (email, password) => call('/admin/login', { method: 'POST', body: { email, password }, anonymous: true }),
  stats: () => call('/admin/stats'),

  messages: {
    list: (status = 'inbox') => call(`/admin/messages?status=${encodeURIComponent(status)}`),
    update: (id, changes) => call(`/admin/messages/${id}`, json('PATCH', changes)),
    remove: (id) => call(`/admin/messages/${id}`, { method: 'DELETE' }),
  },

  events: {
    list: () => call('/admin/events'),
    get: (id) => call(`/admin/events/${id}`),
    create: (event) => call('/admin/events', json('POST', event)),
    update: (id, event) => call(`/admin/events/${id}`, json('PUT', event)),
    remove: (id) => call(`/admin/events/${id}`, { method: 'DELETE' }),
  },

  partners: {
    list: () => call('/admin/partners'),
    create: (partner) => call('/admin/partners', json('POST', partner)),
    update: (id, partner) => call(`/admin/partners/${id}`, json('PUT', partner)),
    remove: (id) => call(`/admin/partners/${id}`, { method: 'DELETE' }),
  },

  subscribers: {
    list: () => call('/admin/subscribers'),
    remove: (id) => call(`/admin/subscribers/${id}`, { method: 'DELETE' }),
  },

  // folder: 'events' | 'partners'. Resolves to { url }.
  uploadImage: (file, folder) => {
    const form = new FormData();
    form.append('file', file);
    return call(`/admin/uploads?folder=${encodeURIComponent(folder)}`, { method: 'POST', form });
  },
};
