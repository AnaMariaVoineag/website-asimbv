import { getJson, getJsonList } from './api';
import { normalizeEvent } from '../utils/events';

export const getEvents = async (options) => {
  const events = await getJson('/events', options);
  return events.map(normalizeEvent);
};

export const getEvent = async (id, options) => normalizeEvent(await getJson(`/events/${id}`, options));

export const getEventPartners = (id, options) => getJsonList(`/events/${id}/partners`, options);
