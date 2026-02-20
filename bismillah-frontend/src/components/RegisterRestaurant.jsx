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
import { apiUrl } from '../config/api';
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
  const [identity, setIdentity] = useState({ name: '', company_number: '', restaurantType: null });
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
  const [contact, setContact] = useState({ website: '', phone: '', streetName: '', addressNumber: '', cityName: '', postalCode: '', countryId: 1 });
  const [formattedPhone, setFormattedPhone] = useState(''); // Téléphone formaté (stocké au passage à l'étape suivante)
  const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' });
  const [isStepValid, setIsStepValid] = useState(false);


  // La validation est gérée par le callback onStepValidChange passé à chaque step
  // Plus besoin du useEffect qui lisait ref.current.isStepValid


  // ----------- Navigation : Suivant -----------
  const handleNextStep = async () => {
    // Appel la méthode validate du step courant (peut inclure une validation API)
    const stepRef = stepRefs[activeStep];
    console.log('[DEBUG handleNextStep] activeStep:', activeStep, 'stepRef:', stepRef);
    if (!stepRef || !stepRef.current || typeof stepRef.current.validate !== 'function') {
      console.log('[DEBUG handleNextStep] No valid stepRef or validate method');
      return;
    }
    const result = await stepRef.current.validate();
    console.log('[DEBUG handleNextStep] validate result:', result);
    setIsStepValid(result && result.valid);
    // Si la validation échoue et qu'il y a un message d'erreur, l'afficher globalement
    if (!result?.valid) {
      console.log('[DEBUG handleNextStep] Validation failed:', result);
      if (result?.message) showMessage(result.message, 'error');
      return;
    }
    // Si on quitte l'étape Coordonnées (index 4), on stocke le téléphone formaté
    if (activeStep === 4) {
      if (stepRef.current?.getFormattedPhone) {
        const formatted = stepRef.current.getFormattedPhone();
        setFormattedPhone(formatted);
        console.log('[DEBUG] Téléphone formaté stocké:', formatted);
      }
    }
    // Si tout est ok, passer à la step suivante
    console.log('[DEBUG handleNextStep] Calling handleNext()');
    handleNext();
  };


  // ----------- Soumission finale -----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    hideMessage();

    // Valider d'abord les champs de StepConnexion
    const stepConnexionRef = stepRefs[5]; // StepConnexion est à l'index 5
    if (stepConnexionRef && stepConnexionRef.current && typeof stepConnexionRef.current.validate === 'function') {
      const result = await stepConnexionRef.current.validate();
      if (!result?.valid) {
        // Les erreurs sont déjà affichées dans les champs
        return;
      }
    }

    setLoading(true);
    try {
      // Utilise le téléphone formaté stocké lors du passage à l'étape suivante
      const phoneToSubmit = formattedPhone || contact.phone;

      // Récupère les données de connexion depuis StepConnexion
      const connexionData = stepConnexionRef.current?.getFormData ? stepConnexionRef.current.getFormData() : {};

      // Formate le company_number avec le préfixe BE (la valeur stockée ne contient que les 10 chiffres)
      const formattedCompanyNumber = identity.company_number.startsWith('BE') 
        ? identity.company_number 
        : `BE${identity.company_number}`;

      // Utilise FormData pour envoyer les données avec le fichier logo
      const formData = new FormData();
      
      // Identité du restaurant
      formData.append('name', identity.name);
      formData.append('company_number', formattedCompanyNumber);
      
      // Type de restaurant: soit un ID existant, soit un nouveau nom à créer
      // Récupère les données du type depuis StepIdentity
      const identityRef = stepRefs[3]; // StepIdentity est à l'index 3
      const identityData = identityRef.current?.getFormData ? identityRef.current.getFormData() : {};
      
      if (identityData.restaurantTypeId) {
        formData.append('restaurantTypeId', identityData.restaurantTypeId);
      } else if (identityData.newTypeName) {
        formData.append('newTypeName', identityData.newTypeName);
      }
      
      // Adresse (le backend trouvera/créera la ville et la rue)
      formData.append('cityName', contact.cityName);
      formData.append('postalCode', contact.postalCode);
      formData.append('countryId', contact.countryId || 1);
      formData.append('streetName', contact.streetName);
      formData.append('address_number', contact.addressNumber);
      
      // Contact
      if (phoneToSubmit) formData.append('phone', phoneToSubmit);
      if (contact.website) formData.append('website', contact.website);
      
      // Connexion
      formData.append('email', connexionData.email);
      formData.append('password', connexionData.password);
      
      // Logo (fichier)
      if (logoState.file) {
        formData.append('logo', logoState.file);
      }
      
      // Langue par défaut
      formData.append('defaultLanguage', 'fr');
      
      // Certification halal (si applicable)
      formData.append('hasCertification', certification.hasCertification === 'yes');
      if (certification.certifierId && certification.certifierId !== 'other') {
        formData.append('certifierId', certification.certifierId);
      }
      if (certification.certifierId === 'other' && certification.customCertifierName) {
        formData.append('customCertifierName', certification.customCertifierName);
      }
      if (certification.certificationNumber) {
        formData.append('certificationNumber', certification.certificationNumber);
      }

      console.log('[DEBUG] FormData envoyé (logo inclus):', logoState.file ? logoState.file.name : 'pas de logo');

      // Appel API pour créer le restaurant (pas de Content-Type, le navigateur l'ajoute automatiquement avec boundary)
      const response = await fetch(apiUrl('/auth/restaurant/signup'), {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('[DEBUG] Réponse API:', data);
      
      if (!response.ok) {
        // Affiche les erreurs de validation si présentes
        const errorMsg = data.errors ? data.errors.join(', ') : (data.message || data.error || 'Erreur lors de l\'inscription');
        throw new Error(errorMsg);
      }
      
      // Stocker le token pour connexion automatique
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Stocker aussi les infos du restaurant si nécessaire
        if (data.restaurant) {
          localStorage.setItem('restaurant', JSON.stringify(data.restaurant));
        }
      }
      
      // Redirection vers le dashboard (connexion automatique)
      showMessage('Inscription réussie !', 'success');
      setTimeout(() => {
        navigate('/restaurant-dashboard');
      }, 1000);

    } catch (err) {
      console.error('[ERROR] Inscription:', err);
      showMessage(err.message || 'Erreur lors de l\'inscription', 'error');
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
              return <StepComponent ref={stepRefs[0]} halalQuestions={halalQuestions} setHalalQuestions={setHalalQuestions} onStepValidChange={setIsStepValid} />;
            }
            if (step.key === 'step.conditions') {
              return <StepComponent ref={stepRefs[1]} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} acceptedCharter={acceptedCharter} setAcceptedCharter={setAcceptedCharter} onStepValidChange={setIsStepValid} />;
            }
            if (step.key === 'step.certification') {
              return <StepComponent ref={stepRefs[2]} certification={certification} setCertification={setCertification} onStepValidChange={setIsStepValid} />;
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
                onStepValidChange={setIsStepValid}
              />;
            }
            if (step.key === 'step.coordinates') {
              return <StepComponent ref={stepRefs[4]} contact={contact} setContact={setContact} onStepValidChange={setIsStepValid} />;
            }
            if (step.key === 'step.connexion') {
              return <StepComponent ref={stepRefs[5]} loading={loading} handleSubmit={handleSubmit} onStepValidChange={setIsStepValid} />;
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
