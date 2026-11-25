import { useRef, useState } from 'react';
import { adminApi } from '../adminApi';
import { useToast } from '../contexts';

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';

// Uploads one or more images and reports each resulting URL through onUploaded(url).
const ImageUploadButton = ({ folder, multiple = false, onUploaded, label = 'Încarcă imagine' }) => {
  const input = useRef(null);
  const [progress, setProgress] = useState(null);
  const toast = useToast();

  const upload = async (files) => {
    const list = [...files];
    for (let i = 0; i < list.length; i++) {
      setProgress(`${i + 1}/${list.length}`);
      try {
        const { url } = await adminApi.uploadImage(list[i], folder);
        onUploaded(url);
      } catch (error) {
        toast(`${list[i].name}: ${error.message}`, 'error');
      }
    }
    setProgress(null);
    if (input.current) input.current.value = '';
  };

  return (
    <>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        hidden
        onChange={(e) => e.target.files.length && upload(e.target.files)}
      />
      <button type="button" className="adm-btn" disabled={progress !== null} onClick={() => input.current?.click()}>
        {progress ? `Se încarcă ${progress}…` : `⬆ ${label}`}
      </button>
    </>
  );
};

export default ImageUploadButton;
