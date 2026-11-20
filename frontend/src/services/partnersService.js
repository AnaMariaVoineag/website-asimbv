import { getJson, getJsonList } from './api';

export const getPartners = (options) => getJson('/partners', options);

export const getFeaturedPartners = (options) => getJsonList('/partners?featured=true', options);
