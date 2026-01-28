import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
// Utilitaire pour valider une étape via son ref
async function validateStep(stepRef) {
  if (stepRef && stepRef.current && typeof stepRef.current.validate === 'function') {
    const result = await stepRef.current.validate();
    return result && result.valid;
  }
  return false;
}
import { useMessage } from '../hooks/useMessage';
import { useFileUpload } from '../hooks/useFileUpload';
import { getPasswordStrength, getStrengthLabel } from '../utils/passwordUtils';
import LinearProgress from '@mui/material/LinearProgress';
import { 
  Box, TextField, Button, Typography, Paper, Alert, 
  Stepper, Step, StepLabel, FormControl, FormLabel, 
  RadioGroup, FormControlLabel, Radio, Select, MenuItem, 
  InputLabel, Checkbox, Link, Autocomplete, CircularProgress,
  InputAdornment
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../i18n';
import StepHalal from './RegisterRestaurantSteps/StepHalal';
import { useStepNavigation } from '../hooks/useStepNavigation';
import StepCertification from './RegisterRestaurantSteps/StepCertification';
import StepConditions from './RegisterRestaurantSteps/StepConditions';
import StepIdentity from './RegisterRestaurantSteps/StepIdentity';
import StepCoordinates from './RegisterRestaurantSteps/StepCoordinates';
import StepConnexion from './RegisterRestaurantSteps/StepConnexion';


// Centralisation des étapes dans un seul tableau d'objets
const stepHalalRef = React.createRef();
const stepConditionsRef = React.createRef();
const stepCertificationRef = React.createRef();
const stepIdentityRef = React.createRef();
const stepCoordinatesRef = React.createRef();
const stepConnexionRef = React.createRef();

const formSteps = [
  //{ key: 'step.halal', ref: stepHalalRef, component: StepHalal },
  //{ key: 'step.conditions', ref: stepConditionsRef, component: StepConditions },
  //{ key: 'step.certification', ref: stepCertificationRef, component: StepCertification },
  { key: 'step.identity', ref: stepIdentityRef, component: StepIdentity },
  { key: 'step.coordinates', ref: stepCoordinatesRef, component: StepCoordinates },
  { key: 'step.connexion', ref: stepConnexionRef, component: StepConnexion },
];

function RegisterRestaurant() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const stepRefs = formSteps.map(step => step.ref);
  const { message, showMessage, hideMessage } = useMessage();
  const { activeStep, handleNext, handleBack, setActiveStep } = useStepNavigation(stepRefs, showMessage, hideMessage);
  const [loading, setLoading] = useState(false);
  const [halalQuestions, setHalalQuestions] = useState({ exclusivelyHalal: '', noAlcohol: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCharter, setAcceptedCharter] = useState(false);
  const [certification, setCertification] = useState({ hasCertification: '', certifierId: '', customCertifierName: '', certificationNumber: '' });
  const [identity, setIdentity] = useState({ name: '', company_number: '', restaurantTypeId: '' });
  const {
    fileState: logoState,
    handleFileChange: handleLogoChange,
    resetFile: resetLogo,
    error: logoError
  } = useFileUpload(
    { accept: 'image/png, image/jpeg', maxSize: 2 * 1024 * 1024 },
    { file: null, preview: '' },
    'file',
    'preview'
  );
  const [contact, setContact] = useState({ website: '', phone: '', streetName: '', address_number: '', cityName: '', postalCode: '', countryId: 1 });
  const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' });
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    const ref = stepRefs[activeStep];
    let mounted = true;
    validateStep(ref).then(valid => { if (mounted) setIsStepValid(valid); });
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, [activeStep, halalQuestions, acceptedTerms, acceptedCharter, certification, identity, contact, credentials]);

  const handleNextWithDebug = async () => {
    const ref = stepRefs[activeStep];
    const valid = await validateStep(ref);
    setIsStepValid(valid);
    if (!valid) return;
    handleNext();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    hideMessage();
    setLoading(true);
    try {
      // ... logique de soumission ...
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2, pb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
            Inscription Restaurant
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {formSteps.map((step, index) => (
              <Step key={step.key}>
                <StepLabel>
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      fontSize: '0.7rem'
                    }}
                  >
                    {t(step.key)}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.showLink ? (
                <>
                  {t('registration.charterError')}{' '}
                  <Link component={RouterLink} to="/charte-halal" sx={{ fontWeight: 600 }}>
                    {t('registration.seeCharter')}
                  </Link>
                </>
              ) : (
                message.text
              )}
            </Alert>
          )}

          {/* Affiche dynamiquement la step courante */}
          {(() => {
            const step = formSteps[activeStep];
            if (!step) return null;
            const StepComponent = step.component;
            if (step.key === 'step.halal') {
              return <StepComponent ref={step.ref} halalQuestions={halalQuestions} setHalalQuestions={setHalalQuestions} />;
            }
            if (step.key === 'step.conditions') {
              return <StepComponent ref={step.ref} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} acceptedCharter={acceptedCharter} setAcceptedCharter={setAcceptedCharter} />;
            }
            if (step.key === 'step.certification') {
              return <StepComponent ref={step.ref} certification={certification} setCertification={setCertification} />;
            }
            if (step.key === 'step.identity') {
              return <StepComponent
                ref={step.ref}
                identity={identity}
                setIdentity={setIdentity}
                logo={logoState.file}
                logoPreview={logoState.preview}
                handleLogoChange={handleLogoChange}
                resetLogo={resetLogo}
                logoError={logoError}
              />;
            }
            if (step.key === 'step.coordinates') {
              return <StepComponent ref={step.ref} contact={contact} setContact={setContact} />;
            }
            if (step.key === 'step.connexion') {
              return <StepComponent ref={step.ref} credentials={credentials} setCredentials={setCredentials} loading={loading} handleSubmit={handleSubmit} />;
            }
            return null;
          })()}

          {activeStep < formSteps.length - 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Retour
              </Button>
              <Button
                variant="contained"
                onClick={handleNextWithDebug}
                disabled={!isStepValid}
              >
                Suivant
              </Button>
            </Box>
          )}

          {activeStep === formSteps.length - 1 && (
            <Button
              onClick={handleBack}
              sx={{ mt: 2 }}
            >
              Retour
            </Button>
          )}

          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            Déjà inscrit ?{' '}
            <Button onClick={() => navigate('/login-restaurant')} sx={{ textTransform: 'none' }}>
              Se connecter
            </Button>
          </Typography>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default RegisterRestaurant;
