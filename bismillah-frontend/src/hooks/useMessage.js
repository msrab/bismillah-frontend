import { useState, useCallback, useRef } from 'react';

/**
 * Hook pour gérer l'affichage d'un message global (succès, erreur, info...)
 * @param {number} autoHideDuration - durée en ms avant masquage auto (0 = jamais)
 */
export function useMessage(autoHideDuration = 0) {
  const [message, setMessage] = useState({ type: '', text: '' });
  const timerRef = useRef();

  // Affiche un message et masque auto si demandé
  const showMessage = useCallback((msg) => {
    setMessage(msg);
    if (autoHideDuration > 0) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, autoHideDuration);
    }
  }, [autoHideDuration]);

  // Masque le message
  const hideMessage = useCallback(() => {
    setMessage({ type: '', text: '' });
    clearTimeout(timerRef.current);
  }, []);

  return { message, showMessage, hideMessage };
}
