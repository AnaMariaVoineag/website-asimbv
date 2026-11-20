import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { uploadForm230 } from '../services/taxService';
import { ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES, EMPTY_EXTRACTED_DATA, OCR_STEPS } from '../constants/tax';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isAcceptedFile = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  return ACCEPTED_MIME_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension);
};

/**
 * Upload + OCR flow of the tax form page.
 * state: 'idle' | 'processing' | 'success' | 'error'
 */
export const useTaxFormUpload = () => {
  const { t, lang } = useI18n();
  const [file, setFile] = useState(null);
  const [state, setState] = useState('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedData, setExtractedData] = useState(EMPTY_EXTRACTED_DATA);

  const fail = (message) => {
    setErrorMessage(message);
    setState('error');
  };

  // Walks through the progress steps while the user waits.
  const showProgress = async () => {
    for (let i = 0; i < OCR_STEPS.length; i++) {
      setCurrentStepIndex(i);
      setProgressPercent(Math.round(((i + 1) / OCR_STEPS.length) * 90));
      await wait(OCR_STEPS[i].duration);
    }
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);

    if (!isAcceptedFile(selectedFile)) {
      fail(t('tax.error.invalidFormat'));
      return;
    }

    setState('processing');
    setCurrentStepIndex(0);
    setProgressPercent(10);
    setErrorMessage('');

    await showProgress();

    try {
      const response = await uploadForm230(selectedFile);

      if (response.ok) {
        setExtractedData(await response.json());
        setProgressPercent(100);
        setState('success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        fail((lang === 'ro' && errorData.message) || t('tax.error.cannotProcess'));
      }
    } catch {
      fail(t('tax.error.networkError'));
    }
  };

  const updateField = (field, value) => {
    setExtractedData((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setFile(null);
    setState('idle');
    setErrorMessage('');
    setCurrentStepIndex(0);
    setProgressPercent(0);
  };

  return { file, state, currentStepIndex, progressPercent, errorMessage, extractedData, processFile, updateField, reset };
};
