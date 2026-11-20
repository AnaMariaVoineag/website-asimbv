import { request, postJson } from './api';

export const subscribe = ({ email, name }) => postJson('/newsletter/subscribe', { email, name });

export const unsubscribe = (token) =>
  request(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, { method: 'DELETE' });
