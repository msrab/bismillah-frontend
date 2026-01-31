// =============================
// Imports & Dependencies
// =============================
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMessage } from '../hooks/useMessage';
import { useFileUpload } from '../hooks/useFileUpload';
import { Box, Button, Typography, Paper, Alert, Stepper, Step, StepLabel, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useStepNavigation } from '../hooks/useStepNavigation';
// Step components
import StepHalal from './RegisterRestaurantSteps/StepHalal';
import StepCertification from './RegisterRestaurantSteps/StepCertification';
import StepConditions from './RegisterRestaurantSteps/StepConditions';
import StepIdentity from './RegisterRestaurantSteps/StepIdentity';
import StepCoordinates from './RegisterRestaurantSteps/StepCoordinates';
import StepConnexion from './RegisterRestaurantSteps/StepConnexion';


// =============================
// Stepper Configuration
// =============================
// Centralise les steps et leurs refs dans un seul tableau
const stepRefs = Array.from({ length: 6 }, () => React.createRef());
const formSteps = [
  { key: 'step.halal', component: StepHalal },
  { key: 'step.conditions', component: StepConditions },
  { key: 'step.certification', component: StepCertification },
  { key: 'step.identity', component: StepIdentity },
  { key: 'step.coordinates', component: StepCoordinates },
  { key: 'step.connexion', component: StepConnexion },
];

// =============================
// Validation utilitaire
// =============================
const validateStep = async (stepRef) => {
  if (stepRef && stepRef.current && typeof stepRef.current.validate === 'function') {
    const result = await stepRef.current.validate();
    return result && result.valid;
  }
  return false;
};


// =============================
// RegisterRestaurant Component
// =============================
function RegisterRestaurant() {
  // ----------- Hooks & State -----------
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { message, showMessage, hideMessage } = useMessage();
  const { activeStep, handleNext, handleBack } = useStepNavigation(stepRefs, showMessage, hideMessage);
  // State pour chaque step (centralisé ici)
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


  // ----------- Validation automatique à chaque changement -----------
  useEffect(() => {
    // On lit le booléen isStepValid exposé par la step courante (si dispo)
    const ref = stepRefs[activeStep];
    if (ref && ref.current && typeof ref.current.isStepValid !== 'undefined') {
      setIsStepValid(!!ref.current.isStepValid);
    } else {
      // fallback : on garde la validation async si la step ne l'expose pas
      let mounted = true;
      validateStep(ref).then(valid => { if (mounted) setIsStepValid(valid); });
      return () => { mounted = false; };
    }
    // eslint-disable-next-line
  }, [activeStep, halalQuestions, acceptedTerms, acceptedCharter, certification, identity, contact, credentials]);


  // ----------- Navigation : Suivant -----------
  const handleNextStep = async () => {
    // Appel la méthode validate du step courant (peut inclure une validation API)
    const stepRef = stepRefs[activeStep];
    if (!stepRef || !stepRef.current || typeof stepRef.current.validate !== 'function') return;
    const result = await stepRef.current.validate();
    setIsStepValid(result && result.valid);
    // Si la validation échoue et qu'il y a un message d'erreur, l'afficher globalement
    if (!result?.valid) {
      if (result?.message) showMessage(result.message, 'error');
      return;
    }
    // Si tout est ok, passer à la step suivante
    handleNext();
  };


  // ----------- Soumission finale -----------
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


  // =============================
  // Render
  // =============================
  return (
    <>
      {/* ----------- Layout ----------- */}
      <Navbar />
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2, pb: 4 }}>
        <Paper sx={{ p: 4 }}>
          {/* ----------- Titre ----------- */}
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
            Inscription Restaurant
          </Typography>

          {/* ----------- Stepper ----------- */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {formSteps.map((step, idx) => (
              <Step key={step.key}>
                <StepLabel>
                  <Typography
                    variant="caption"
                    sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.7rem' }}
                  >
                    {t(step.key)}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* ----------- Message d'alerte ----------- */}
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

          {/* ----------- Step dynamique ----------- */}
          {(() => {
            const step = formSteps[activeStep];
            if (!step) return null;
            const StepComponent = step.component;
            // Props dynamiques selon la step
            if (step.key === 'step.halal') {
              return <StepComponent ref={stepRefs[0]} halalQuestions={halalQuestions} setHalalQuestions={setHalalQuestions} />;
            }
            if (step.key === 'step.conditions') {
              return <StepComponent ref={stepRefs[1]} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} acceptedCharter={acceptedCharter} setAcceptedCharter={setAcceptedCharter} />;
            }
            if (step.key === 'step.certification') {
              return <StepComponent ref={stepRefs[2]} certification={certification} setCertification={setCertification} />;
            }
            if (step.key === 'step.identity') {
              return <StepComponent
                ref={stepRefs[3]}
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
              return <StepComponent ref={stepRefs[4]} contact={contact} setContact={setContact} />;
            }
            if (step.key === 'step.connexion') {
              return <StepComponent ref={stepRefs[5]} credentials={credentials} setCredentials={setCredentials} loading={loading} handleSubmit={handleSubmit} />;
            }
            return null;
          })()}

          {/* ----------- Boutons navigation ----------- */}
          {activeStep < formSteps.length - 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>Retour</Button>
              <Button variant="contained" onClick={handleNextStep} disabled={!isStepValid}>Suivant</Button>
            </Box>
          )}
          {activeStep === formSteps.length - 1 && (
            <Button onClick={handleBack} sx={{ mt: 2 }}>Retour</Button>
          )}

          {/* ----------- Lien connexion ----------- */}
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
