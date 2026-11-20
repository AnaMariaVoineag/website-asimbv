import { request, getJson, getJsonList } from './api';

export const getEvents = (options) => getJson('/events', options);

export const getEvent = (id) => request(`/events/${id}`);

export const getEventPartners = (id, options) => getJsonList(`/events/${id}/partners`, options);
