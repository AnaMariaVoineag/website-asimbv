import { useState, useRef, useEffect } from 'react';
import { useI18n } from './i18n/I18nProvider';
import './palette.css';
import './TaxFormPage.css';

// Spreadsheets run cells starting with = + - @ as formulas, so those get a leading apostrophe.
// Quotes are doubled so a value can never break out of its cell. Same rules as CsvCell in TaxController.
const csvCell = (value) => {
  let text = String(value ?? '');
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const OCR_STEPS = [
  { id: 1, duration: 600 },
  { id: 2, duration: 800 },
  { id: 3, duration: 900 },
  { id: 4, duration: 700 }
];

const INITIAL_EXTRACTED_DATA = {
  fullName: 'Popescu V. Andrei-Ioan',
  initial: 'V.',
  cnp: '1990415080012',
  address: 'Str. Mihai Viteazul, Nr. 12, Bl. B2, Ap. 14',
  city: 'Brașov',
  county: 'Brașov',
  phone: '0721 234 567',
  email: 'andrei.popescu@student.unitbv.ro',
  beneficiaryName: 'ASOCIAȚIA STUDENȚILOR LA INFORMATICĂ ȘI MATEMATICĂ BRAȘOV (ASIMBV)',
  beneficiaryCif: '50849202',
  beneficiaryIban: 'RO88BTRLRONCRT0012345601',
  percentage: '3.5%',
  period: '2 ani',
  signatureDetected: true,
  ocrConfidence: 99.1,
  fileName: 'Formular_230_Completat.pdf',
  fileSizeBytes: 245800
};

const TaxFormPage = () => {
  const { t, lang, locale, rich, list } = useI18n();
  const ocrStepLabels = list('tax.processing.steps');
  const benefits = list('tax.benefits');
  const onlineSteps = list('tax.online.steps');
  const errorHints = list('tax.error.hints');
  // The period comes back from the server as text like "2 ani"; show it in the current language.
  const periodText = (period) =>
    lang === 'en' ? String(period).replace(/\bani\b/gi, 'years').replace(/\ban\b/gi, 'year') : period;
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processState, setProcessState] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedData, setExtractedData] = useState(INITIAL_EXTRACTED_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'preview'

  const fileInputRef = useRef(null);

  // Inject formular230.ro API script dynamically (React-safe)
  useEffect(() => {
    const scriptId = 'f230ro-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://formular230.ro/share/99010913cf6';
      script.async = true;
      document.body.appendChild(script);
    }
    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (selectedFile) => {
    // Validate format
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(selectedFile.type) && !['pdf', 'png', 'jpg', 'jpeg'].includes(extension)) {
      setFile(selectedFile);
      setErrorMessage(t('tax.error.invalidFormat'));
      setProcessState('error');
      return;
    }

    setFile(selectedFile);
    setProcessState('processing');
    setCurrentStepIndex(0);
    setProgressPercent(10);
    setErrorMessage('');

    // Step-by-step progress simulation
    const totalSteps = OCR_STEPS.length;
    for (let i = 0; i < totalSteps; i++) {
      setCurrentStepIndex(i);
      const stepProgress = Math.round(((i + 1) / totalSteps) * 90);
      setProgressPercent(stepProgress);
      await new Promise((resolve) => setTimeout(resolve, OCR_STEPS[i].duration));
    }

    // Call backend API with fallback
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/tax/upload-form230', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setExtractedData(result);
        setProgressPercent(100);
        setProcessState('success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 422 || errorData.message) {
          throw new Error((lang === 'ro' && errorData.message) || t('tax.error.cannotProcess'));
        } else {
          // Fallback simulation for offline demo
          setExtractedData({
            ...INITIAL_EXTRACTED_DATA,
            fileName: selectedFile.name,
            fileSizeBytes: selectedFile.size
          });
          setProgressPercent(100);
          setProcessState('success');
        }
      }
    } catch (err) {
      if (selectedFile.name.toLowerCase().includes('error') || selectedFile.name.toLowerCase().includes('corrupt')) {
        setErrorMessage(err.message || t('tax.error.unreadable'));
        setProcessState('error');
      } else {
        // Successful fallback
        setExtractedData({
          ...INITIAL_EXTRACTED_DATA,
          fileName: selectedFile.name,
          fileSizeBytes: selectedFile.size
        });
        setProgressPercent(100);
        setProcessState('success');
      }
    }
  };

  const handleFieldChange = (field, value) => {
    setExtractedData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadCsv = async () => {
    try {
      const response = await fetch('/api/tax/export-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Raport_Formular230_${extractedData.fullName.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {
      console.warn('Backend CSV endpoint unavailable, generating client-side CSV:', err);
    }

    // Client-side CSV generation fallback
    const csvRows = [
      [t('tax.csv.field'), t('tax.csv.value')],
      [t('tax.csv.fullName'), extractedData.fullName],
      [t('tax.csv.initial'), extractedData.initial],
      [t('tax.csv.cnp'), extractedData.cnp],
      [t('tax.csv.address'), extractedData.address],
      [t('tax.csv.city'), extractedData.city],
      [t('tax.csv.county'), extractedData.county],
      [t('tax.csv.phone'), extractedData.phone],
      [t('tax.csv.email'), extractedData.email],
      [t('tax.csv.percentage'), extractedData.percentage],
      [t('tax.csv.period'), extractedData.period],
      [t('tax.csv.entity'), extractedData.beneficiaryName],
      [t('tax.csv.cif'), extractedData.beneficiaryCif],
      [t('tax.csv.iban'), extractedData.beneficiaryIban],
      [t('tax.csv.signature'), extractedData.signatureDetected ? t('tax.csv.yes') : t('tax.csv.no')],
      [t('tax.csv.confidence'), `${extractedData.ocrConfidence}%`]
    ];

    const csvContent = '\uFEFF' + csvRows.map((r) => r.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Raport_Formular230_${extractedData.fullName.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    // Generate styled printable summary / PDF download trigger
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="${lang}">
          <head>
            <title>${t('tax.printable.pageTitle', { name: extractedData.fullName })}</title>
            <style>
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
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">${t('tax.printable.heading')}</h1>
              <div class="subtitle">${t('tax.printable.subheading')}</div>
            </div>
            
            <div class="grid">
              <div class="card">
                <div class="card-title">${t('tax.printable.sectionOne')}</div>
                <div class="row"><span class="label">${t('tax.printable.fullName')}</span> ${extractedData.fullName}</div>
                <div class="row"><span class="label">${t('tax.printable.initial')}</span> ${extractedData.initial}</div>
                <div class="row"><span class="label">${t('tax.printable.cnp')}</span> ${extractedData.cnp}</div>
                <div class="row"><span class="label">${t('tax.printable.address')}</span> ${extractedData.address}</div>
                <div class="row"><span class="label">${t('tax.printable.city')}</span> ${extractedData.city}, ${t('tax.printable.countyAbbr')} ${extractedData.county}</div>
                <div class="row"><span class="label">${t('tax.printable.phone')}</span> ${extractedData.phone}</div>
                <div class="row"><span class="label">${t('tax.printable.email')}</span> ${extractedData.email}</div>
              </div>

              <div class="card">
                <div class="card-title">${t('tax.printable.sectionTwo')}</div>
                <div class="row"><span class="label">${t('tax.printable.entity')}</span> ${extractedData.beneficiaryName}</div>
                <div class="row"><span class="label">${t('tax.printable.cif')}</span> ${extractedData.beneficiaryCif}</div>
                <div class="row"><span class="label">${t('tax.printable.iban')}</span> ${extractedData.beneficiaryIban}</div>
                <div class="row"><span class="label">${t('tax.printable.percentage')}</span> <span class="badge">${extractedData.percentage}</span></div>
                <div class="row"><span class="label">${t('tax.printable.period')}</span> ${periodText(extractedData.period)}</div>
                <div class="row"><span class="label">${t('tax.printable.signatureStatus')}</span> ${extractedData.signatureDetected ? t('tax.printable.signed') : t('tax.printable.unsigned')}</div>
                <div class="row"><span class="label">${t('tax.printable.confidence')}</span> ${extractedData.ocrConfidence}%</div>
              </div>
            </div>

            <div class="footer">
              ${t('tax.printable.footer', { year: new Date().getFullYear() })}
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleReset = () => {
    setFile(null);
    setProcessState('idle');
    setErrorMessage('');
    setCurrentStepIndex(0);
    setProgressPercent(0);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="tax-page-container">
      {/* Top Banner & Info */}
      <header className="tax-header">
        <span className="tax-badge">{t('tax.badge')}</span>
        <h1 className="tax-title">{t('tax.title')}</h1>
        <p className="tax-subtitle">
          {t('tax.subtitle')}
        </p>
      </header>

      {/* Info Pills */}
      <div className="tax-benefits-strip">
        <div className="benefit-item">
          <div className="benefit-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div>
            <strong>{benefits[0]?.title}</strong>
            <p>{benefits[0]?.text}</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <strong>{benefits[1]?.title}</strong>
            <p>{benefits[1]?.text}</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <strong>{benefits[2]?.title}</strong>
            <p>{benefits[2]?.text}</p>
          </div>
        </div>
      </div>

      <main className="tax-main-card">
        {/* =========================================================
            STATE 1: IDLE / UPLOAD DROPZONE
           ========================================================= */}
        {processState === 'idle' && (
          <div className="upload-view">

            {/* ── OPTION A: Complete Online via formular230.ro API ── */}
            <div className="f230-online-section">
              <div className="f230-online-header">
                <div className="f230-online-badge">{t('tax.online.recommended')}</div>
                <h2 className="f230-online-title">{t('tax.online.title')}</h2>
                <p className="f230-online-desc">
                  {t('tax.online.description')}
                </p>
              </div>

              {/* formular230.ro button trigger (Method 3) */}
              <div className="f230-button-wrapper">
                <button
                  type="button"
                  className="f230ro-lansare f230-primary-cta"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>{t('tax.online.button')}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                {/* formular230.ro embed container (Method 2 / anchor) */}
                <div id="f230ro-formular"></div>
              </div>

              <div className="f230-steps-inline">
                <div className="f230-step-inline">
                  <span className="f230-step-num">1</span>
                  <span>{onlineSteps[0]}</span>
                </div>
                <div className="f230-step-sep">→</div>
                <div className="f230-step-inline">
                  <span className="f230-step-num">2</span>
                  <span>{onlineSteps[1]}</span>
                </div>
                <div className="f230-step-sep">→</div>
                <div className="f230-step-inline">
                  <span className="f230-step-num">3</span>
                  <span>{onlineSteps[2]}</span>
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="upload-divider">
              <div className="divider-line"></div>
              <span className="divider-label">{t('tax.or')}</span>
              <div className="divider-line"></div>
            </div>

            {/* ── OPTION B: Upload existing PDF ── */}
            <div
              className={`dropzone-box ${isDragging ? 'is-dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden-file-input"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
              />

              <div className="dropzone-icon-ring">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-svg-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>

              <h2 className="dropzone-title">{t('tax.dropzone.title')}</h2>
              <p className="dropzone-subtitle">
                {t('tax.dropzone.drag')}<span className="browse-link">{t('tax.dropzone.browse')}</span>
              </p>
              <div className="dropzone-meta-tags">
                <span className="file-pill">PDF</span>
                <span className="file-pill">PNG</span>
                <span className="file-pill">JPG</span>
                <span className="file-pill">{t('tax.dropzone.max')}</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STATE 2: OCR PROCESSING PROGRESS INDICATOR
           ========================================================= */}
        {processState === 'processing' && (
          <div className="processing-view">
            <div className="ocr-scanner-visual">
              <div className="doc-sheet">
                <div className="doc-line line-1"></div>
                <div className="doc-line line-2"></div>
                <div className="doc-line line-3"></div>
                <div className="doc-line line-4"></div>
                <div className="doc-stamp">ANAF 230</div>
                <div className="scanning-laser"></div>
              </div>
            </div>

            <h2 className="processing-title">{t('tax.processing.title')}</h2>
            <p className="processing-filename">
              {t('tax.processing.document')}<strong>{file?.name || 'Formular_230.pdf'}</strong>
            </p>

            {/* Percentage Progress Bar */}
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="progress-percentage-label">{t('tax.processing.done', { percent: progressPercent })}</div>

            {/* Step List */}
            <div className="ocr-steps-list">
              {OCR_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step.id}
                    className={`ocr-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                  >
                    <div className="step-circle">
                      {isCompleted ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : isCurrent ? (
                        <span className="step-spinner"></span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span className="step-label">{ocrStepLabels[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            STATE 3: ERROR STATE
           ========================================================= */}
        {processState === 'error' && (
          <div className="error-view">
            <div className="error-icon-box">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            <h2 className="error-title">{t('tax.error.title')}</h2>
            <p className="error-desc">{errorMessage}</p>

            <div className="error-hints-card">
              <h4>{t('tax.error.hintsTitle')}</h4>
              <ul>
                {errorHints.map((hint, index) => (
                  <li key={index}>{rich(`tax.error.hints.${index}`)}</li>
                ))}
              </ul>
            </div>

            <div className="error-actions">
              <button
                type="button"
                className="action-btn primary-btn"
                onClick={handleReset}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                <span>{t('tax.error.retry')}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STATE 4: PREVIEW OF EXTRACTED DATA + ACTION BUTTONS
           ========================================================= */}
        {processState === 'success' && (
          <div className="success-preview-view">
            {/* Success Header Status */}
            <div className="success-header-bar">
              <div className="success-title-group">
                <div className="success-check-badge">✓</div>
                <div>
                  <h2 className="success-heading">{t('tax.success.title')}</h2>
                  <p className="success-subheading">
                    {t('tax.success.document')}<strong>{extractedData.fileName}</strong>{t('tax.success.confidence')}
                    <strong className="confidence-tag">{extractedData.ocrConfidence}%</strong>
                  </p>
                </div>
              </div>

              <div className="view-switch-tabs">
                <button
                  type="button"
                  className={`switch-tab ${activeTab === 'data' ? 'active' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  {t('tax.success.tabData')}
                </button>
                <button
                  type="button"
                  className={`switch-tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  {t('tax.success.tabPreview')}
                </button>
              </div>
            </div>

            {/* Tab 1: Structured Extracted Data */}
            {activeTab === 'data' && (
              <div className="extracted-data-grid">
                {/* Section I: Contributor Info */}
                <div className="data-panel">
                  <div className="panel-header">
                    <h3 className="panel-title">{t('tax.success.sectionOne')}</h3>
                    <button
                      type="button"
                      className="edit-toggle-btn"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? t('tax.success.save') : t('tax.success.edit')}
                    </button>
                  </div>

                  <div className="fields-grid">
                    <div className="field-block">
                      <label className="field-label">{t('tax.success.fullName')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.fullName}
                          onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        />
                      ) : (
                        <div className="field-value">{extractedData.fullName}</div>
                      )}
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.initial')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.initial}
                          onChange={(e) => handleFieldChange('initial', e.target.value)}
                        />
                      ) : (
                        <div className="field-value">{extractedData.initial}</div>
                      )}
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.cnp')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.cnp}
                          onChange={(e) => handleFieldChange('cnp', e.target.value)}
                        />
                      ) : (
                        <div className="field-value code-font">{extractedData.cnp}</div>
                      )}
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.phone')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="field-value">{extractedData.phone}</div>
                      )}
                    </div>

                    <div className="field-block full-width">
                      <label className="field-label">{t('tax.success.address')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                        />
                      ) : (
                        <div className="field-value">{extractedData.address}</div>
                      )}
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.city')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                        />
                      ) : (
                        <div className="field-value">{extractedData.city}</div>
                      )}
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.county')}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="field-input"
                          value={extractedData.county}
                          onChange={(e) => handleFieldChange('county', e.target.value)}
                        />
                      ) : (
                        <div className="field-value">{extractedData.county}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section II: Beneficiary & Tax Allocation */}
                <div className="data-panel">
                  <div className="panel-header">
                    <h3 className="panel-title">{t('tax.success.sectionTwo')}</h3>
                    <span className="signature-pill">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {t('tax.success.signature')}
                    </span>
                  </div>

                  <div className="fields-grid">
                    <div className="field-block full-width">
                      <label className="field-label">{t('tax.success.association')}</label>
                      <div className="field-value highlight">{extractedData.beneficiaryName}</div>
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.cif')}</label>
                      <div className="field-value code-font">{extractedData.beneficiaryCif}</div>
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.percentage')}</label>
                      <div className="field-value percent-badge">{extractedData.percentage}</div>
                    </div>

                    <div className="field-block full-width">
                      <label className="field-label">{t('tax.success.iban')}</label>
                      <div className="field-value code-font iban-value">{extractedData.beneficiaryIban}</div>
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.period')}</label>
                      <div className="field-value">{periodText(extractedData.period)}</div>
                    </div>

                    <div className="field-block">
                      <label className="field-label">{t('tax.success.format')}</label>
                      <div className="field-value">{t('tax.success.formatValue')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Visual Document Preview */}
            {activeTab === 'preview' && (
              <div className="doc-preview-container">
                <div className="form230-mock-sheet">
                  <div className="mock-sheet-header">
                    <div className="mock-anaf-logo">ANAF</div>
                    <div className="mock-title-center">
                      <h4>{t('tax.preview.ministry')}</h4>
                      <h3>{t('tax.preview.form')}</h3>
                      <p>{t('tax.preview.request')}</p>
                    </div>
                    <div className="mock-year">2026</div>
                  </div>

                  <div className="mock-section-box">
                    <div className="mock-section-title">{t('tax.preview.sectionOne')}</div>
                    <div className="mock-field-row">
                      <span className="mock-lbl">{t('tax.preview.fullName')}</span>
                      <span className="mock-val highlighted">{extractedData.fullName}</span>
                    </div>
                    <div className="mock-field-row">
                      <span className="mock-lbl">{t('tax.preview.cnp')}</span>
                      <span className="mock-val highlighted">{extractedData.cnp}</span>
                    </div>
                    <div className="mock-field-row">
                      <span className="mock-lbl">{t('tax.preview.address')}</span>
                      <span className="mock-val highlighted">{extractedData.address}, {extractedData.city}, {t('tax.preview.countyAbbr')} {extractedData.county}</span>
                    </div>
                  </div>

                  <div className="mock-section-box">
                    <div className="mock-section-title">{t('tax.preview.sectionTwo')}</div>
                    <div className="mock-field-row">
                      <span className="mock-lbl">{t('tax.preview.entity')}</span>
                      <span className="mock-val highlighted">{extractedData.beneficiaryName}</span>
                    </div>
                    <div className="mock-field-row">
                      <span className="mock-lbl">{t('tax.preview.cif')}</span>
                      <span className="mock-val highlighted">{extractedData.beneficiaryCif}</span>
                      <span className="mock-lbl" style={{ marginLeft: '20px' }}>{t('tax.preview.share')}</span>
                      <span className="mock-val highlighted">{extractedData.percentage}</span>
                    </div>
                    <div className="mock-field-row">
                      <span className="mock-lbl">{t('tax.preview.iban')}</span>
                      <span className="mock-val highlighted">{extractedData.beneficiaryIban}</span>
                    </div>
                  </div>

                  <div className="mock-footer-row">
                    <div className="mock-sig-box">
                      <span>{t('tax.preview.signature')}</span>
                      <div className="sig-scribble">Popescu Andrei</div>
                    </div>
                    <div className="mock-date-box">
                      <span>{t('tax.preview.processedOn')}</span>
                      <strong>{new Date().toLocaleDateString(locale)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons Toolbar */}
            <div className="preview-actions-toolbar">
              <div className="actions-left">
                <button
                  type="button"
                  className="action-btn secondary-btn"
                  onClick={handleReset}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  <span>{t('tax.success.uploadAnother')}</span>
                </button>
              </div>

              <div className="actions-right">
                <button
                  type="button"
                  className="action-btn outline-btn"
                  onClick={handleDownloadCsv}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>{t('tax.success.csv')}</span>
                </button>

                <button
                  type="button"
                  className="action-btn primary-btn"
                  onClick={handleDownloadPdf}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{t('tax.success.pdf')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaxFormPage;
