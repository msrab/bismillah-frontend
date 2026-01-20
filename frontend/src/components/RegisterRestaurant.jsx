import { useState, useEffect, useCallback, useRef } from 'react';
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
  const { message, showMessage, hideMessage } = useMessage();
  const { activeStep, handleNext, handleBack, setActiveStep } = useStepNavigation(stepRefs, showMessage, hideMessage);

  // Debug : log contact à chaque passage au step suivant
  const handleNextWithDebug = async () => {
    // On valide l'étape avant d'avancer
    const ref = stepRefs[activeStep];
    const valid = await validateStep(ref);
    setIsStepValid(valid);
    if (!valid) return;
    console.log('Contact (coordonnées) au step', activeStep, ':', contact);
    handleNext();
    setTimeout(() => {
      console.log('Step après navigation :', activeStep + 1);
    }, 100);
  };
  const [loading, setLoading] = useState(false);

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
  // Hook pour gérer logo et preview, avec accept et maxSize personnalisés
  const {
    fileState: logoState,
    handleFileChange: handleLogoChange,
    resetFile: resetLogo,
    error: logoError
  } = useFileUpload(
    { accept: 'image/png, image/jpeg', maxSize: 2 * 1024 * 1024 }, // 2 Mo, png/jpeg
    { file: null, preview: '' },
    'file',
    'preview'
  );

  // Étape 5 - Coordonnées 
  const [contact, setContact] = useState({
    website: '',
    phone: '',
    streetName: '',
    address_number: '',
    cityName: '',
    postalCode: '',
    countryId: 1,
    // cityId supprimé, on ne l'utilise plus à ce stade
  });

  // Étape 6 - Données de connexion
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // État pour activer/désactiver le bouton suivant
  const [isStepValid, setIsStepValid] = useState(false);

  // Met à jour la validité à chaque changement d'étape ou de données
  useEffect(() => {
    const ref = stepRefs[activeStep];
    let mounted = true;
    validateStep(ref).then(valid => { if (mounted) setIsStepValid(valid); });
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, [activeStep, halalQuestions, acceptedTerms, acceptedCharter, certification, identity, contact, credentials]);

  
  // Soumission finale du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    hideMessage();
    setLoading(true);

    try {
      // 0. Vérifier ou créer la ville (nom + code postal) si besoin
      const cityName = contact.cityName;
      const cityPostalCode = contact.postalCode;
      const countryId = contact.countryId || 1;
      let cityId = null;
      if (cityName && cityPostalCode) {
        // Recherche de la ville en base par nom + code postal
        const searchRes = await fetch(`http://localhost:5000/api/cities/search?name=${encodeURIComponent(cityName)}&postalCode=${encodeURIComponent(cityPostalCode)}&countryId=${encodeURIComponent(countryId)}`);
        const searchData = await searchRes.json();
        if (searchRes.ok && Array.isArray(searchData) && searchData.length > 0 && searchData[0].id) {
          cityId = searchData[0].id;
        } else {
          // Si la ville n'existe pas, on la crée
          const cityPayload = {
            name: cityName,
            postal_code: cityPostalCode,
            countryId
          };
          const cityRes = await fetch('http://localhost:5000/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cityPayload)
          });
          const cityData = await cityRes.json();
          if (cityRes.ok && cityData.id) {
            cityId = cityData.id;
          } else {
            showMessage({ type: 'error', text: cityData.message || "Impossible de créer la ville." });
            setLoading(false);
            return;
          }
        }
      }
      if (!cityId) {
        showMessage({ type: 'error', text: "Veuillez renseigner une ville et un code postal valides." });
        setLoading(false);
        return;
      }

      // Préparer les données
      const registrationData = {
        // Identité
        name: identity.name,
        company_number: identity.company_number,
        restaurantTypeId: identity.restaurantTypeId || null,
        // Connexion
        email: credentials.email,
        password: credentials.password,
        // Coordonnées
        phone: contact.phone,
        website: contact.website || null,
        address_number: contact.address_number,
        // Adresse - on envoie les infos pour créer/trouver la rue
        cityId,
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
        showMessage({ type: 'error', text: registerData.message || "Erreur lors de l'inscription" });
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

      showMessage({ type: 'success', text: 'Inscription réussie ! Redirection...' });
      setTimeout(() => navigate('/login-restaurant'), 2000);

    } catch (error) {
      showMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
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

        {/* Affiche la step courante et log le step */}
        <>
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
              logoError={logoError}
            />
          )}
          {activeStep === 4 && (
            <StepCoordinates ref={stepCoordinatesRef} contact={contact} setContact={setContact} />
          )}
          {activeStep === 5 && (
            <StepConnexion ref={stepConnexionRef} credentials={credentials} setCredentials={setCredentials} loading={loading} handleSubmit={handleSubmit} />
          )}
        </>

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
              onClick={handleNextWithDebug}
              disabled={!isStepValid}
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
