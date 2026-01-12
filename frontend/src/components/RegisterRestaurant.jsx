import { useState, useEffect, useCallback } from 'react';
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
import { useRef } from 'react';
import StepCertification from './RegisterRestaurantSteps/StepCertification';
import StepConditions from './RegisterRestaurantSteps/StepConditions';
import StepIdentity from './RegisterRestaurantSteps/StepIdentity';
import StepCoordinates from './RegisterRestaurantSteps/StepCoordinates';
import StepConnexion from './RegisterRestaurantSteps/StepConnexion';

const steps = [
  'Vérification Halal', 
  'Certification', 
  'Conditions', 
  'Identité',
  'Coordonnées',
  'Connexion'
];

// ...existing code...

function RegisterRestaurant() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);

  // Étape 1 - Questions Halal
  const [halalQuestions, setHalalQuestions] = useState({
    exclusivelyHalal: '',
    noAlcohol: ''
  });
  const stepHalalRef = useRef();
  const stepCertificationRef = useRef();
  const stepConditionsRef = useRef();
  const stepIdentityRef = useRef();
  const stepCoordinatesRef = useRef();
  const stepConnexionRef = useRef();

  // Étape 2 - Certification
  const [certification, setCertification] = useState({
    hasCertification: '',
    certifierId: '',
    customCertifierName: '',
    certificationNumber: ''
  });

  // Étape 3 - Conditions d'utilisation
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCharter, setAcceptedCharter] = useState(false);

  // Étape 4 - Identité du restaurant
  const [identity, setIdentity] = useState({
    name: '',
    logo: null,
    logoPreview: '',
    company_number: '',
    restaurantTypeId: ''
  });

  // Étape 5 - Données de connexion
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Étape 6 - Coordonnées
  const [contact, setContact] = useState({
    website: '',
    phone: '',
    streetName: '',
    address_number: ''
  });



  // Gestion du logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdentity({
        ...identity,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleNext = async () => {
    setMessage({ type: '', text: '' });
    let result;
    if (activeStep === 0) result = stepHalalRef.current?.validate();
    if (activeStep === 1) result = await stepCertificationRef.current?.validate();
    if (activeStep === 2) result = stepConditionsRef.current?.validate();
    if (activeStep === 3) result = await stepIdentityRef.current?.validate();
    if (activeStep === 4) result = await stepCoordinatesRef.current?.validate();
    if (activeStep === 5) result = await stepConnexionRef.current?.validate();
    if (result && !result.valid) {
      setMessage({ type: 'error', text: result.message, showLink: result.showLink });
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setMessage({ type: '', text: '' });
    setActiveStep(prev => prev - 1);
  };

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
      if (identity.logo && registerData.restaurant?.id) {
        const formData = new FormData();
        formData.append('logo', identity.logo);
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
          <StepCertification ref={stepCertificationRef} certification={certification} setCertification={setCertification} />
        )}
        {activeStep === 2 && (
          <StepConditions ref={stepConditionsRef} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} acceptedCharter={acceptedCharter} setAcceptedCharter={setAcceptedCharter} />
        )}
        {activeStep === 3 && (
          <StepIdentity ref={stepIdentityRef} identity={identity} setIdentity={setIdentity} handleLogoChange={handleLogoChange} />
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
