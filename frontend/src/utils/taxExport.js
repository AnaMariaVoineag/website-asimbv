import { exportCsv } from '../services/taxService';
import { escapeHtml } from './html';
import { formatPeriod, reportFileName } from './taxFormatters';

// Spreadsheets run cells starting with = + - @ as formulas, so those get a leading apostrophe.
// Quotes are doubled so a value can never break out of its cell. Same rules as CsvCell in TaxController.
const csvCell = (value) => {
  let text = String(value ?? '');
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const buildCsv = (data, t) => {
  const rows = [
    [t('tax.csv.field'), t('tax.csv.value')],
    [t('tax.csv.fullName'), data.fullName],
    [t('tax.csv.initial'), data.initial],
    [t('tax.csv.cnp'), data.cnp],
    [t('tax.csv.address'), data.address],
    [t('tax.csv.city'), data.city],
    [t('tax.csv.county'), data.county],
    [t('tax.csv.phone'), data.phone],
    [t('tax.csv.email'), data.email],
    [t('tax.csv.percentage'), data.percentage],
    [t('tax.csv.period'), data.period],
    [t('tax.csv.entity'), data.beneficiaryName],
    [t('tax.csv.cif'), data.beneficiaryCif],
    [t('tax.csv.iban'), data.beneficiaryIban],
    [t('tax.csv.signature'), data.signatureDetected ? t('tax.csv.yes') : t('tax.csv.no')],
    [t('tax.csv.confidence'), `${data.ocrConfidence}%`],
  ];
  return '﻿' + rows.map((row) => row.map(csvCell).join(',')).join('\n');
};

/**
 * Downloads the extracted data as CSV. Prefers the backend report and falls back to
 * generating the file in the browser when the endpoint is unavailable.
 */
export const downloadCsvReport = async (data, t) => {
  const fileName = reportFileName(data);

  try {
    const response = await exportCsv(data);
    if (response.ok) {
      downloadBlob(await response.blob(), fileName);
      return;
    }
  } catch (err) {
    console.warn('Backend CSV endpoint unavailable, generating client-side CSV:', err);
  }

  downloadBlob(new Blob([buildCsv(data, t)], { type: 'text/csv;charset=utf-8;' }), fileName);
};

const PRINT_STYLES = `
  body { font-family: 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; }
  .header { text-align: center; border-bottom: 2px solid #003977; padding-bottom: 15px; margin-bottom: 25px; }
  .title { color: #003977; font-size: 20px; font-weight: bold; margin: 0; }
  .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc; }
  .card-title { font-size: 12px; font-weight: bold; color: #003977; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
  .row { margin-bottom: 8px; font-size: 13px; }
  .label { font-weight: bold; color: #475569; }
  .badge { display: inline-block; background: #003977; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
  .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
`;

const buildPrintableHtml = (data, t, lang) => {
  const row = (labelKey, value, { raw = false } = {}) =>
    `<div class="row"><span class="label">${t(labelKey)}</span> ${raw ? value : escapeHtml(value)}</div>`;

  const personal = [
    row('tax.printable.fullName', data.fullName),
    row('tax.printable.initial', data.initial),
    row('tax.printable.cnp', data.cnp),
    row('tax.printable.address', data.address),
    row('tax.printable.city', `${data.city}, ${t('tax.printable.countyAbbr')} ${data.county}`),
    row('tax.printable.phone', data.phone),
    row('tax.printable.email', data.email),
  ].join('');

  const beneficiary = [
    row('tax.printable.entity', data.beneficiaryName),
    row('tax.printable.cif', data.beneficiaryCif),
    row('tax.printable.iban', data.beneficiaryIban),
    row('tax.printable.percentage', `<span class="badge">${escapeHtml(data.percentage)}</span>`, { raw: true }),
    row('tax.printable.period', formatPeriod(data.period, lang)),
    row('tax.printable.signatureStatus', data.signatureDetected ? t('tax.printable.signed') : t('tax.printable.unsigned')),
    row('tax.printable.confidence', `${data.ocrConfidence}%`),
  ].join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <title>${escapeHtml(t('tax.printable.pageTitle', { name: data.fullName }))}</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>
    <div class="header">
      <h1 class="title">${t('tax.printable.heading')}</h1>
      <div class="subtitle">${t('tax.printable.subheading')}</div>
    </div>
    <div class="grid">
      <div class="card"><div class="card-title">${t('tax.printable.sectionOne')}</div>${personal}</div>
      <div class="card"><div class="card-title">${t('tax.printable.sectionTwo')}</div>${beneficiary}</div>
    </div>
    <div class="footer">${t('tax.printable.footer', { year: new Date().getFullYear() })}</div>
    <script>window.print();</script>
  </body>
</html>`;
};

// Opens a printable summary in a new window; the browser print dialog offers "Save as PDF".
export const openPrintableReport = (data, t, lang) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(buildPrintableHtml(data, t, lang));
  printWindow.document.close();
};
