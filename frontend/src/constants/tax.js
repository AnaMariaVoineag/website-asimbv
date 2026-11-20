export const OCR_STEPS = [
  { id: 1, duration: 600 },
  { id: 2, duration: 800 },
  { id: 3, duration: 900 },
  { id: 4, duration: 700 },
];

export const EMPTY_EXTRACTED_DATA = {
  fullName: '',
  initial: '',
  cnp: '',
  address: '',
  city: '',
  county: '',
  phone: '',
  email: '',
  beneficiaryName: '',
  beneficiaryCif: '',
  beneficiaryIban: '',
  percentage: '',
  period: '',
  signatureDetected: false,
  ocrConfidence: 0,
  fileName: '',
  fileSizeBytes: 0,
};

export const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
export const ACCEPTED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'];
export const FILE_INPUT_ACCEPT = '.pdf,image/png,image/jpeg,image/jpg';

// Third-party script that powers the "complete online" button.
export const FORMULAR_230_SCRIPT_ID = 'f230ro-script';
export const FORMULAR_230_SCRIPT_URL = 'https://formular230.ro/share/99010913cf6';

// Fields of the first section that can be edited after extraction.
export const PERSONAL_FIELDS = [
  { name: 'fullName', labelKey: 'tax.success.fullName' },
  { name: 'initial', labelKey: 'tax.success.initial' },
  { name: 'cnp', labelKey: 'tax.success.cnp', valueClass: 'code-font' },
  { name: 'phone', labelKey: 'tax.success.phone' },
  { name: 'address', labelKey: 'tax.success.address', fullWidth: true },
  { name: 'city', labelKey: 'tax.success.city' },
  { name: 'county', labelKey: 'tax.success.county' },
];
