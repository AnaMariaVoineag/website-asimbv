// The period comes back from the server as text like "2 ani"; show it in the current language.
export const formatPeriod = (period, lang) =>
  lang === 'en' ? String(period).replace(/\bani\b/gi, 'years').replace(/\ban\b/gi, 'year') : period;

export const reportFileName = (data) => `Raport_Formular230_${data.fullName.replace(/\s+/g, '_')}.csv`;
