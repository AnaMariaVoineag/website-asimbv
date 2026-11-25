// Keep in sync with AdminEventsController.Categories and the filters of the public events page.
export const CATEGORY_LABELS = {
  Workshop: 'Workshop',
  Social: 'Social',
  Competition: 'Competiție',
};

export const PARTNER_TYPE_LABELS = {
  '': 'Doar pe paginile evenimentelor',
  educational: 'Partener educațional',
  affiliation: 'Afiliere',
  association: 'Asociație',
  company: 'Companie / sponsor',
};

export const LIMITS = {
  title: 200,
  date: 100,
  description: 600,
  longDescription: 20000,
  role: 100,
};
