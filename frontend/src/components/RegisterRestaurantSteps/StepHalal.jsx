import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

// Étape 1 - Vérification Halal
export default function StepHalal({ halalQuestions, setHalalQuestions }) {
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
}