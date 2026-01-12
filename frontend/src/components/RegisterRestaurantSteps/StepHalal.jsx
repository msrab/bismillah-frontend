import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';

// Étape 1 - Vérification Halal
const StepHalal = forwardRef(({ halalQuestions, setHalalQuestions }, ref) => {
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!halalQuestions.exclusivelyHalal || !halalQuestions.noAlcohol) {
        return { valid: false, message: 'Veuillez répondre à toutes les questions' };
      }
      if (halalQuestions.exclusivelyHalal === 'no') {
        return { valid: false, message: 'charter_error', showLink: true };
      }
      if (halalQuestions.noAlcohol === 'yes') {
        return { valid: false, message: 'charter_error', showLink: true };
      }
      return { valid: true };
    }
  }), [halalQuestions]);
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Vérification des critères Halal
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">
          Votre établissement sert-il exclusivement de la viande halal ?
        </FormLabel>
        <RadioGroup
          value={halalQuestions.exclusivelyHalal}
          onChange={(e) => setHalalQuestions({ ...halalQuestions, exclusivelyHalal: e.target.value })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Oui, exclusivement halal" />
          <FormControlLabel value="no" control={<Radio />} label="Non" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">
          Votre établissement propose-t-il des boissons alcoolisées ?
        </FormLabel>
        <RadioGroup
          value={halalQuestions.noAlcohol}
          onChange={(e) => setHalalQuestions({ ...halalQuestions, noAlcohol: e.target.value })}
        >
          <FormControlLabel value="no" control={<Radio />} label="Non, nous ne proposons pas d'alcool" />
          <FormControlLabel value="yes" control={<Radio />} label="Oui, nous proposons de l'alcool" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
});
export default StepHalal;