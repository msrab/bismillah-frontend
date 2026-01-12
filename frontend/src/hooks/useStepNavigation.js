import { useState } from 'react';

/**
 * Centralise la navigation et la validation des étapes du formulaire
 * @param {Array} stepRefs - Tableau de refs pour chaque étape
 * @param {Function} setMessage - Setter pour les messages d'erreur
 */
export function useStepNavigation(stepRefs, setMessage) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    const ref = stepRefs[activeStep];
    if (ref && ref.current && typeof ref.current.validate === 'function') {
      const result = await ref.current.validate();
      if (!result.valid) {
        setMessage({ type: 'error', text: result.message, showLink: result.showLink });
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  return { activeStep, handleNext, handleBack, setActiveStep };
}
