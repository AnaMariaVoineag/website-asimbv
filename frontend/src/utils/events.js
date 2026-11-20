import { assetUrl } from './assetUrl';

const MONTHS = {
  ianuarie: 0, februarie: 1, martie: 2, aprilie: 3, mai: 4, iunie: 5,
  iulie: 6, august: 7, septembrie: 8, octombrie: 9, noiembrie: 10, decembrie: 11,
};

// Turns "31 octombrie 2026", "21-24 mai 2026" or "Septembrie 2026" into a sortable timestamp.
// Returns null when the text has no recognizable month + year.
export const parseRoDate = (text) => {
  if (!text) return null;
  const match = text
    .toLowerCase()
    .match(/(?:(\d{1,2})(?:\s*-\s*\d{1,2})?\s+)?([a-zăâîșț]+)\s+(\d{4})/);
  if (!match) return null;
  const month = MONTHS[match[2]];
  if (month === undefined) return null;
  return new Date(Number(match[3]), month, match[1] ? Number(match[1]) : 1).getTime();
};

export const parseImages = (imagesJson) => {
  if (!imagesJson) return [];
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed.map(assetUrl) : [];
  } catch {
    return [];
  }
};

// Backend shape -> what the UI expects: images as resolved URLs, formUrl never undefined.
export const normalizeEvent = (event) => ({
  ...event,
  images: parseImages(event.images),
  formUrl: event.formUrl ?? null,
});

// Keeps the API order: roles appear in the order of their first partner.
export const groupByRole = (partners) => {
  const groups = new Map();
  partners.forEach((partner) => {
    if (!groups.has(partner.role)) groups.set(partner.role, []);
    groups.get(partner.role).push(partner);
  });
  return [...groups.entries()];
};

// Newest first by event date; events whose date can't be read fall back to id order (newest id first).
export const sortNewestFirst = (events) =>
  [...events].sort((a, b) => {
    const da = parseRoDate(a.date);
    const db = parseRoDate(b.date);
    if (da !== null && db !== null && da !== db) return db - da;
    return b.id - a.id;
  });
