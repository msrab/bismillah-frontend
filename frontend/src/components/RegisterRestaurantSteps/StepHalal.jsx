
import React, { forwardRef, useImperativeHandle, useState } from 'react';
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
 */



const StepHalal = forwardRef(({ halalQuestions, setHalalQuestions }, ref) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Réinitialise submitted et error à chaque arrivée sur la step ou changement de questions
  React.useEffect(() => {
    setSubmitted(false);
    setError('');
  }, [halalQuestions]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      setSubmitted(true);
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
  }), [halalQuestions]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Vérification des critères Halal
      </Typography>

      {/* Affichage de l'erreur uniquement après soumission */}
      {submitted && error && (
        <Typography color="error" sx={{ mb: 2 }}>{error === 'charter_error' ? "Votre établissement ne respecte pas la charte halal." : error}</Typography>
      )}

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