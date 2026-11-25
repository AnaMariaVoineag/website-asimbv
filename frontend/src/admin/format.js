// The backend sends UTC times; SQLite drops the "Z", which would make the browser read them as local time.
export const parseServerDate = (value) => {
  if (!value) return null;
  const text = /[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value) => {
  const date = parseServerDate(value);
  return date
    ? date.toLocaleString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';
};

export const formatDate = (value) => {
  const date = parseServerDate(value);
  return date ? date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
};

// "acum 5 min", "ieri", or the date for anything older than a week.
export const formatRelative = (value) => {
  const date = parseServerDate(value);
  if (!date) return '—';
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'acum';
  if (minutes < 60) return `acum ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `acum ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'ieri';
  if (days < 7) return `acum ${days} zile`;
  return formatDate(value);
};

// Spreadsheets run cells starting with = + - @ as formulas, so those get a leading apostrophe.
const csvCell = (value) => {
  let text = value == null ? '' : String(value);
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export const downloadCsv = (fileName, header, rows) => {
  const csv = '\uFEFF' + [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// "1 imagine" / "3 imagini"
export const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

export const todayStamp = () => new Date().toISOString().slice(0, 10);

export const matchesSearch = (search, ...fields) => {
  const term = search.trim().toLowerCase();
  return !term || fields.some((field) => field?.toLowerCase().includes(term));
};
