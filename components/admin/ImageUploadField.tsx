import React, { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { aS } from './adminStyles';

interface Props {
  value: string;
  onChange: (url: string) => void;
  specHint?: string;
  storageFolder?: string;
  maxSizeKb?: number;
}

export const ImageUploadField: React.FC<Props> = ({
  value,
  onChange,
  specHint,
  storageFolder = 'uploads',
  maxSizeKb,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sizeWarn, setSizeWarn] = useState('');

  const handleFile = (file: File) => {
    setSizeWarn('');
    if (maxSizeKb && file.size > maxSizeKb * 1024) {
      setSizeWarn(`Arquivo tem ${Math.round(file.size / 1024)}kb — recomendado máx ${maxSizeKb}kb. Upload prosseguirá mesmo assim.`);
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `admin_uploads/${storageFolder}/${Date.now()}.${ext}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setProgress(0);

    task.on(
      'state_changed',
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => setUploading(false),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setUploading(false);
        setProgress(0);
      }
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <input
          style={{ ...aS.input, flex: 1 }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... ou faça upload →"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            ...aS.btnSecondary,
            whiteSpace: 'nowrap',
            opacity: uploading ? .5 : 1,
            cursor: uploading ? 'default' : 'pointer',
          }}
        >
          {uploading ? `${progress}%` : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
      </div>
      {specHint && (
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--ink-3)', marginTop: '.3rem' }}>
          {specHint}
        </div>
      )}
      {sizeWarn && (
        <div style={{ fontFamily: 'var(--fb)', fontSize: '.75rem', color: '#b45309', marginTop: '.25rem' }}>
          ⚠ {sizeWarn}
        </div>
      )}
      {value && (
        <img
          src={value}
          alt="preview"
          style={{ marginTop: '.6rem', maxWidth: '100%', maxHeight: 160, objectFit: 'contain', border: '1px solid var(--rule)' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
    </div>
  );
};
