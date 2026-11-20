import { postJson } from './api';

export const sendContactMessage = (formData) => postJson('/contact', formData);
