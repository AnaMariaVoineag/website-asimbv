export const ROUTES = {
  home: '/',
  events: '/events',
  eventDetails: (id) => `/event-details/${id}`,
  contact: '/contact',
  partners: '/parteneri',
  taxForm: '/formular-230',
  taxFormAlias: '/redirectioneaza-3.5',
  unsubscribe: '/dezabonare',
  feedback: '/feedback',
  privacyPolicy: '/privacy-policy',
};

export const EVENT_DETAILS_PATTERN = '/event-details/:id';
