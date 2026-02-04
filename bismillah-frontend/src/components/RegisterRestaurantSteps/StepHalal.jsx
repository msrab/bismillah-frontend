
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

/**
 * Composant StepHalal
 * Étape 1 du formulaire d'inscription restaurant : vérification des critères halal
 * - Affiche deux questions (exclusivement halal, pas d'alcool)
 * - Expose une méthode validate() via la ref pour valider les réponses
 *
 * Props :
 *   - halalQuestions : { exclusivelyHalal: 'yes'|'no'|undefined, noAlcohol: 'yes'|'no'|undefined }
 *   - setHalalQuestions : fonction pour mettre à jour halalQuestions
 *   - onStepValidChange : callback pour notifier le parent de la validité
 */



const StepHalal = forwardRef(({ halalQuestions, setHalalQuestions, onStepValidChange }, ref) => {
  const [error, setError] = useState('');

  // Etat local pour la validité live de la step
  const [isStepValid, setIsStepValid] = useState(false);

  // Validation live à chaque changement (sans side effects)
  useEffect(() => {
    // La step est valide si les deux questions sont répondues avec les bonnes valeurs
    // Question 1: "exclusivement halal ?" → doit être "yes"
    // Question 2: "propose de l'alcool ?" → doit être "no" (pas d'alcool)
    const valid = halalQuestions.exclusivelyHalal === 'yes' && halalQuestions.noAlcohol === 'no';
    //console.log('[DEBUG StepHalal] exclusivelyHalal:', halalQuestions.exclusivelyHalal, 'noAlcohol:', halalQuestions.noAlcohol, '→ valid:', valid);
    setIsStepValid(valid);
    if (onStepValidChange) onStepValidChange(valid);
  }, [halalQuestions, onStepValidChange]);

  useImperativeHandle(ref, () => ({
    isStepValid,
    validate: () => {
      // On ne valide que si les deux questions sont cochées
      if (!halalQuestions.exclusivelyHalal || !halalQuestions.noAlcohol) {
        return { valid: false };
      }
      // Si l'établissement n'est pas exclusivement halal, on bloque
      if (halalQuestions.exclusivelyHalal !== 'yes') {
        setError('charter_error');
        return { valid: false, message: 'charter_error', showLink: true };
      }
      // Si l'établissement propose de l'alcool, on bloque
      if (halalQuestions.noAlcohol !== 'no') {
        setError('charter_error');
        return { valid: false, message: 'charter_error', showLink: true };
      }
      setError('');
      return { valid: true };
    }
  }), [halalQuestions, isStepValid]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Vérification des critères Halal
      </Typography>

      {/* Question 1 : exclusivement halal */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">
          Votre établissement sert-il exclusivement de la viande halal ?
        </FormLabel>
        <RadioGroup
          value={halalQuestions.exclusivelyHalal}
          onChange={(e) => setHalalQuestions({ ...halalQuestions, exclusivelyHalal: e.target.value })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Oui" />
          <FormControlLabel value="no" control={<Radio />} label="Non" />
        </RadioGroup>
      </FormControl>

      {/* Question 2 : alcool */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">
          Votre établissement propose-t-il des boissons alcoolisées ?
        </FormLabel>
        <RadioGroup
          value={halalQuestions.noAlcohol}
          onChange={(e) => setHalalQuestions({ ...halalQuestions, noAlcohol: e.target.value })}
        >
          <FormControlLabel value="no" control={<Radio />} label="Non" />
          <FormControlLabel value="yes" control={<Radio />} label="Oui" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
});

export default StepHalal;