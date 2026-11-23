import { request, postJson } from './api';

export const uploadForm230 = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/tax/upload-form230', { method: 'POST', body: formData });
};

export const exportCsv = (data) => postJson('/tax/export-csv', data);
