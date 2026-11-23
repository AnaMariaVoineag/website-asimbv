import { useRef, useState } from 'react';
import { UploadIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';
import { FILE_INPUT_ACCEPT } from '../../constants/tax';

// Option B: upload an already filled-in form (drag & drop or file picker).
const Dropzone = ({ onFile }) => {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`dropzone-box ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden-file-input"
        accept={FILE_INPUT_ACCEPT}
        onChange={handleSelect}
      />

      <div className="dropzone-icon-ring">
        <UploadIcon size={36} className="upload-svg-icon" />
      </div>

      <h2 className="dropzone-title">{t('tax.dropzone.title')}</h2>
      <p className="dropzone-subtitle">
        {t('tax.dropzone.drag')}
        <span className="browse-link">{t('tax.dropzone.browse')}</span>
      </p>
      <div className="dropzone-meta-tags">
        <span className="file-pill">PDF</span>
        <span className="file-pill">PNG</span>
        <span className="file-pill">JPG</span>
        <span className="file-pill">{t('tax.dropzone.max')}</span>
      </div>
    </div>
  );
};

export default Dropzone;
