import { useState } from 'react';

/**
 * Hook personnalisé pour gérer l'upload et la prévisualisation d'un fichier (ex: logo)
 * @param {Object} initialState - état initial (ex: { file: null, preview: '' })
 * @param {string} fileKey - clé pour le fichier dans l'état (par défaut 'file')
 * @param {string} previewKey - clé pour la preview dans l'état (par défaut 'preview')
 */
export function useFileUpload(initialState = { file: null, preview: '' }, fileKey = 'file', previewKey = 'preview') {
  const [fileState, setFileState] = useState(initialState);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileState({
        ...fileState,
        [fileKey]: file,
        [previewKey]: URL.createObjectURL(file)
      });
    }
  };

  const resetFile = () => setFileState(initialState);

  return {
    fileState,
    setFileState,
    handleFileChange,
    resetFile
  };
}
