import { useState } from 'react';
import { assetUrl } from '../../utils/assetUrl';
import ImageUploadButton from './ImageUploadButton';

const move = (list, from, to) => {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

// Ordered list of event images. The first one is the cover shown on the event cards.
const ImageListEditor = ({ images, onChange }) => {
  const [path, setPath] = useState('');

  const addPath = () => {
    const value = path.trim();
    if (!value) return;
    onChange([...images, value]);
    setPath('');
  };

  return (
    <div className="adm-images">
      {images.length === 0 && <p className="adm-muted">Fără imagini: cardul evenimentului va afișa un fundal simplu.</p>}

      <ol className="adm-image-grid">
        {images.map((src, index) => (
          <li key={`${src}-${index}`} className="adm-image-item">
            <img src={assetUrl(src)} alt="" loading="lazy" />
            {index === 0 && <span className="adm-image-cover">Copertă</span>}
            <div className="adm-image-actions">
              <button type="button" className="adm-icon-btn" disabled={index === 0} onClick={() => onChange(move(images, index, index - 1))} aria-label="Mută mai devreme">←</button>
              <button type="button" className="adm-icon-btn" disabled={index === images.length - 1} onClick={() => onChange(move(images, index, index + 1))} aria-label="Mută mai târziu">→</button>
              <button type="button" className="adm-icon-btn adm-icon-danger" onClick={() => onChange(images.filter((_, i) => i !== index))} aria-label="Elimină">×</button>
            </div>
            <span className="adm-image-path" title={src}>{src.split('/').pop()}</span>
          </li>
        ))}
      </ol>

      <div className="adm-inline-form">
        <ImageUploadButton folder="events" multiple label="Încarcă imagini" onUploaded={(url) => onChange((current) => [...current, url])} />
        <span className="adm-muted">sau</span>
        <input
          className="adm-input"
          placeholder="/poze_evenimente/folder/imagine.png"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addPath();
            }
          }}
        />
        <button type="button" className="adm-btn" onClick={addPath} disabled={!path.trim()}>Adaugă</button>
      </div>
      <p className="adm-field-hint">PNG, JPG, WEBP sau GIF, cel mult 8 MB fiecare. Ordinea de aici este ordinea din galerie.</p>
    </div>
  );
};

export default ImageListEditor;
