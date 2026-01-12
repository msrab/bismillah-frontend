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

    // Validation étape 1
    if (activeStep === 0) {
      if (!halalQuestions.exclusivelyHalal || !halalQuestions.noAlcohol) {
        setMessage({ type: 'error', text: 'Veuillez répondre à toutes les questions' });
        return;
      }
      if (halalQuestions.exclusivelyHalal === 'no') {
        setMessage({ type: 'error', text: 'charter_error', showLink: true });
        return;
      }
      if (halalQuestions.noAlcohol === 'yes') {
        setMessage({ type: 'error', text: 'charter_error', showLink: true });
        return;
      }
    }

    // Validation étape 2
    if (activeStep === 1) {
      if (!certification.hasCertification) {
        setMessage({ type: 'error', text: 'Veuillez indiquer si vous avez une certification' });
        return;
      }
      if (certification.hasCertification === 'yes') {
        if (!certification.certifierId) {
          setMessage({ type: 'error', text: 'Veuillez choisir un certificateur' });
          return;
        }
        if (certification.certifierId === 'other' && !certification.customCertifierName) {
          setMessage({ type: 'error', text: 'Veuillez entrer le nom de votre certificateur' });
          return;
        }
        if (!certification.certificationNumber) {
          setMessage({ type: 'error', text: 'Veuillez entrer votre numéro de certification' });
          return;
        }
        // Validation alphanumérique max 15 caractères
        if (!/^[a-zA-Z0-9]{1,15}$/.test(certification.certificationNumber)) {
          setMessage({ type: 'error', text: 'Le numéro de certification doit être alphanumérique (max 15 caractères)'});
          return;
        }
        // Vérification unicité numéro de certification
        const checkCertif = await fetch(`http://localhost:5000/api/restaurants/check-certification-number?certificationNumber=${encodeURIComponent(certification.certificationNumber)}`);
        const checkCertifData = await checkCertif.json();
        if (checkCertifData.exists) {
          setMessage({ type: 'error', text: 'Ce numéro de certification existe déjà.' });
          return;
        }
      }
    }

    // Validation étape 3 - Conditions
    if (activeStep === 2) {
      if (!acceptedTerms || !acceptedCharter) {
        setMessage({ type: 'error', text: 'Vous devez accepter les conditions d\'utilisation et la charte halal pour continuer' });
        return;
      }
    }

    // Validation étape 4 - Identité
    if (activeStep === 3) {
      if (!identity.name.trim()) {
        setMessage({ type: 'error', text: 'Le nom du restaurant est requis' });
        return;
      }
      if (!identity.company_number.trim()) {
        setMessage({ type: 'error', text: 'Le numéro d\'entreprise est requis' });
        return;
      }
      // Validation format BCE belge
      const bceRegex = /^BE\s?0?\d{3}\.??\d{3}\.??\d{3}$/i;
      if (!bceRegex.test(identity.company_number.replace(/\s/g, ''))) {
        setMessage({ type: 'error', text: 'Format de numéro d\'entreprise invalide (ex: BE0123456789)' });
        return;
      }
      // Vérification unicité numéro d'entreprise
      const checkCompany = await fetch(`http://localhost:5000/api/restaurants/check-company-number?company_number=${encodeURIComponent(identity.company_number)}`);
      const checkCompanyData = await checkCompany.json();
      if (checkCompanyData.exists) {
        setMessage({ type: 'error', text: 'Ce numéro d\'entreprise existe déjà.' });
        return;
      }
    }

    // Validation étape 5 - Coordonnées
    if (activeStep === 4) {
      if (!contact.phone.trim()) {
        setMessage({ type: 'error', text: 'Le numéro de téléphone est requis' });
        return;
      }
      if (!selectedCity) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une ville' });
        return;
      }
      if (!contact.streetName.trim()) {
        setMessage({ type: 'error', text: 'Le nom de rue est requis' });
        return;
      }
      if (!contact.address_number.trim()) {
        setMessage({ type: 'error', text: 'Le numéro d\'adresse est requis' });
        return;
      }
      // Vérification unicité adresse (streetId + numéro)
      if (selectedCity && contact.address_number.trim()) {
        // streetId = selectedCity.id (format: code-ville)
        const checkAddress = await fetch(`http://localhost:5000/api/restaurants/check-address?streetId=${encodeURIComponent(selectedCity.id)}&address_number=${encodeURIComponent(contact.address_number)}`);
        const checkAddressData = await checkAddress.json();
        if (checkAddressData.exists) {
          setMessage({ type: 'error', text: "Un restaurant existe déjà à cette adresse." });
          return;
        }
      }
    }

    // Validation étape Connexion (maintenant étape 4)
    if (activeStep === 5) {
      if (!credentials.email.trim()) {
        setMessage({ type: 'error', text: "L'email est requis" });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        setMessage({ type: 'error', text: "Format d'email invalide" });
        return;
      }
      // Vérification unicité email
      const checkEmail = await fetch(`http://localhost:5000/api/restaurants/check-email?email=${encodeURIComponent(credentials.email)}`);
      const checkEmailData = await checkEmail.json();
      if (checkEmailData.exists) {
        setMessage({ type: 'error', text: "Cet email est déjà utilisé." });
        return;
      }
      if (!credentials.password) {
        setMessage({ type: 'error', text: 'Le mot de passe est requis' });
        return;
      }
      if (credentials.password.length < 8) {
        setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
        return;
      }
      if (credentials.password !== credentials.confirmPassword) {
        setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
        return;
      }
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
          <StepHalal halalQuestions={halalQuestions} setHalalQuestions={setHalalQuestions} />
        )}
        {activeStep === 1 && (
          <StepCertification certification={certification} setCertification={setCertification} />
        )}
        {activeStep === 2 && (
          <StepConditions acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} acceptedCharter={acceptedCharter} setAcceptedCharter={setAcceptedCharter} />
        )}
        {activeStep === 3 && (
          <StepIdentity identity={identity} setIdentity={setIdentity} handleLogoChange={handleLogoChange} />
        )}
        {activeStep === 4 && (
          <StepCoordinates contact={contact} setContact={setContact} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
        )}
        {activeStep === 5 && (
          <StepConnexion credentials={credentials} setCredentials={setCredentials} loading={loading} getPasswordStrength={getPasswordStrength} getStrengthLabel={getStrengthLabel} handleSubmit={handleSubmit} />
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
