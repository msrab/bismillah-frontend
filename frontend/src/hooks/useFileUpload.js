import { useState } from 'react';

/**
 * Hook personnalisé pour gérer l'upload et la prévisualisation d'un fichier (ex: logo)
 * @param {Object} options - options de configuration
 * @param {string} options.accept - types MIME acceptés (ex: 'image/png, image/jpeg')
 * @param {number} options.maxSize - taille max en octets (ex: 2*1024*1024 pour 2Mo)
 * @param {Object} initialState - état initial (ex: { file: null, preview: '' })
 * @param {string} fileKey - clé pour le fichier dans l'état (par défaut 'file')
 * @param {string} previewKey - clé pour la preview dans l'état (par défaut 'preview')
 */
export function useFileUpload(
  options = {},
  initialState = { file: null, preview: '' },
  fileKey = 'file',
  previewKey = 'preview'
) {
  const { accept, maxSize } = options;
  const [fileState, setFileState] = useState(initialState);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification du type
    if (accept && !accept.split(',').map(type => type.trim()).includes(file.type)) {
      setError('Type de fichier non autorisé.');
      return;
    }
    // Vérification de la taille
    if (maxSize && file.size > maxSize) {
      setError(`Fichier trop volumineux (max ${(maxSize/1024/1024).toFixed(2)} Mo).`);
      return;
    }

    setFileState({
      ...fileState,
      [fileKey]: file,
      [previewKey]: URL.createObjectURL(file)
    });
    setError('');
  };

  const resetFile = () => {
    setFileState(initialState);
    setError('');
  };

  return {
    fileState,
    setFileState,
    handleFileChange,
    resetFile,
    error
  };
}
