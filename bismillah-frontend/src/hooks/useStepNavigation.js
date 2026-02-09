import { useState } from 'react';

/**
 * Centralise la navigation et la validation des étapes du formulaire
 * @param {Array} stepRefs - Tableau de refs pour chaque étape
 * @param {Function} setMessage - Setter pour les messages d'erreur
 */
export function useStepNavigation(stepRefs, setMessage, hideMessage) {
  const [activeStep, setActiveStep] = useState(0);

  // handleNext ne fait plus de validation - elle est gérée par handleNextStep dans RegisterRestaurant
  const handleNext = () => {
    hideMessage && hideMessage();
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    hideMessage && hideMessage();
    setActiveStep(prev => prev - 1);
  };

  return { activeStep, handleNext, handleBack, setActiveStep };
}
