import { getJson } from './api';

export const getPartners = (options) => getJson('/partners', options);
