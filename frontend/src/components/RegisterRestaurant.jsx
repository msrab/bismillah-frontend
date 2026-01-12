import { useState, useEffect, useCallback, useRef } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import { getPasswordStrength, getStrengthLabel } from '../utils/password';
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

const steps = [
  'Vérification Halal',
  'Conditions',
  'Certification',
  'Identité',
  'Coordonnées',
  'Connexion'
];


function RegisterRestaurant() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  // Centralisation navigation/validation via hook
  const stepHalalRef = useRef();
  const stepCertificationRef = useRef();
  const stepConditionsRef = useRef();
  const stepIdentityRef = useRef();
  const stepCoordinatesRef = useRef();
  const stepConnexionRef = useRef();
  const stepRefs = [
    stepHalalRef,         // 0 - Halal
    stepConditionsRef,    // 1 - Conditions
    stepCertificationRef, // 2 - Certification
    stepIdentityRef,      // 3 - Identité
    stepCoordinatesRef,   // 4 - Coordonnées
    stepConnexionRef      // 5 - Connexion
  ];
  const { activeStep, handleNext, handleBack, setActiveStep } = useStepNavigation(stepRefs, setMessage);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);

  // Étape 1 - Questions Halal
  const [halalQuestions, setHalalQuestions] = useState({
    exclusivelyHalal: '',
    noAlcohol: ''
  });
  
  // Étape 2 - Conditions d'utilisation
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCharter, setAcceptedCharter] = useState(false);

  // Étape 3 - Certification
  const [certification, setCertification] = useState({
    hasCertification: '',
    certifierId: '',
    customCertifierName: '',
    certificationNumber: ''
  });

  // Étape 4 - Identité du restaurant (logo géré par hook)
  const [identity, setIdentity] = useState({
    name: '',
    company_number: '',
    restaurantTypeId: ''
  });
  // Hook pour gérer logo et preview
  const { fileState: logoState, handleFileChange: handleLogoChange, resetFile: resetLogo } = useFileUpload({ file: null, preview: '' }, 'file', 'preview');

  // Étape 5 - Coordonnées
  const [contact, setContact] = useState({
    website: '',
    phone: '',
    streetName: '',
    address_number: ''
  });

  // Étape 6 - Données de connexion
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });



  // Plus besoin de handleLogoChange ici, géré par le hook useFileUpload

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      // Préparer les données
      const registrationData = {
        // Identité
        name: identity.name,
        company_number: identity.company_number.replace(/\s/g, '').toUpperCase(),
        restaurantTypeId: identity.restaurantTypeId || null,
        // Connexion
        email: credentials.email,
        password: credentials.password,
        // Coordonnées
        phone: contact.phone,
        website: contact.website || null,
        address_number: contact.address_number,
        // Adresse - on envoie les infos pour créer/trouver la rue
        cityId: selectedCity.id,
        streetName: contact.streetName,
        // Langue par défaut
        defaultLanguage: language
      };

      // 1. Inscription du restaurant
      const registerRes = await fetch('http://localhost:5000/api/auth/restaurant/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setMessage({ type: 'error', text: registerData.message || 'Erreur lors de l\'inscription' });
        setLoading(false);
        return;
      }

      // 2. Si certification, on se connecte puis on ajoute la certification
      if (certification.hasCertification === 'yes') {
        const loginRes = await fetch('http://localhost:5000/api/auth/restaurant/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          await fetch('http://localhost:5000/api/certifications', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
              certifierId: certification.certifierId === 'other' ? null : parseInt(certification.certifierId),
              custom_certifier_name: certification.certifierId === 'other' ? certification.customCertifierName : null,
              certification_number: certification.certificationNumber
            })
          });
        }
      }

      // 3. Upload du logo si présent
      if (logoState.file && registerData.restaurant?.id) {
        const formData = new FormData();
        formData.append('logo', logoState.file);
        // TODO: Implémenter l'upload du logo
        // await fetch(`http://localhost:5000/api/restaurants/${registerData.restaurant.id}/logo`, {
        //   method: 'POST',
        //   headers: { 'Authorization': `Bearer ${loginData.token}` },
        //   body: formData
        // });
      }

      setMessage({ type: 'success', text: 'Inscription réussie ! Redirection...' });
      setTimeout(() => navigate('/login-restaurant'), 2000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2, pb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
          Inscription Restaurant
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontSize: '0.7rem'
                  }}
                >
                  {label}
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

        {activeStep === 0 && (
          <StepHalal ref={stepHalalRef} halalQuestions={halalQuestions} setHalalQuestions={setHalalQuestions} />
        )}
        {activeStep === 1 && (
          <StepConditions ref={stepConditionsRef} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} acceptedCharter={acceptedCharter} setAcceptedCharter={setAcceptedCharter} />
        )}
        {activeStep === 2 && (
          <StepCertification ref={stepCertificationRef} certification={certification} setCertification={setCertification} />
        )}
        {activeStep === 3 && (
          <StepIdentity
            ref={stepIdentityRef}
            identity={identity}
            setIdentity={setIdentity}
            logo={logoState.file}
            logoPreview={logoState.preview}
            handleLogoChange={handleLogoChange}
            resetLogo={resetLogo}
          />
        )}
        {activeStep === 4 && (
          <StepCoordinates ref={stepCoordinatesRef} contact={contact} setContact={setContact} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
        )}
        {activeStep === 5 && (
          <StepConnexion ref={stepConnexionRef} credentials={credentials} setCredentials={setCredentials} loading={loading} handleSubmit={handleSubmit} />
        )}

        {activeStep < 5 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Suivant
            </Button>
          </Box>
        )}

        {activeStep === 5 && (
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
  );
}

export default RegisterRestaurant;
