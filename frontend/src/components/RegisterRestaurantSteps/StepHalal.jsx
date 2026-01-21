
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';

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
  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    /**
     * Valide les réponses aux questions halal
     * - Les deux questions doivent être répondues
     * - Si l'établissement n'est pas exclusivement halal OU propose de l'alcool, on bloque l'inscription
     * @returns { valid: boolean, message: string, showLink?: boolean }
     */
    validate: () => {
      // Vérifie que toutes les questions sont répondues
      if (!halalQuestions.exclusivelyHalal || !halalQuestions.noAlcohol) {
        return { valid: false, message: 'Veuillez répondre à toutes les questions' };
      }
      // Si l'établissement n'est pas exclusivement halal, on bloque
      if (halalQuestions.exclusivelyHalal === 'no') {
        return { valid: false, message: 'charter_error', showLink: true };
      }
      // Si l'établissement propose de l'alcool, on bloque
      if (halalQuestions.noAlcohol === 'yes') {
        return { valid: false, message: 'charter_error', showLink: true };
      }
      // Tout est conforme
      return { valid: true };
    }
  }), [halalQuestions]);

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