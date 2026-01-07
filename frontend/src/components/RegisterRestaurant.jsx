import { useState, useEffect, useCallback } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, Alert, 
  Stepper, Step, StepLabel, FormControl, FormLabel, 
  RadioGroup, FormControlLabel, Radio, Select, MenuItem, 
  InputLabel, Checkbox, Link, Autocomplete, CircularProgress,
  InputAdornment
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../i18n';

const steps = [
  'Vérification Halal', 
  'Certification', 
  'Conditions', 
  'Identité',
  'Coordonnées',
  'Connexion'
];

function RegisterRestaurant() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [certifiers, setCertifiers] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);

  // Autocomplétion ville
  const [citySearch, setCitySearch] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
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

  // Charger les certificateurs et types de restaurant
  useEffect(() => {
    fetch('http://localhost:5000/api/certifiers')
      .then(res => res.json())
      .then(data => setCertifiers(Array.isArray(data) ? data : []))
      .catch(err => console.error('Erreur chargement certificateurs:', err));

    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setRestaurantTypes(Array.isArray(data) ? data : []))
      .catch(err => console.error('Erreur chargement types:', err));
  }, []);

  // Recherche de villes avec debounce
  const searchCities = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setCityOptions([]);
      return;
    }

    setCityLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cities/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setCityOptions(data);
    } catch (error) {
      console.error('Erreur recherche villes:', error);
    } finally {
      setCityLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(citySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, searchCities]);

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

    // Validation étape 6 - Connexion (après inversion des étapes)
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

    // Validation finale - Coordonnées
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

  // ============ RENDUS DES ÉTAPES ============

  // Étape 1 - Questions Halal
  const renderStep1 = () => (
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

  // Étape 2 - Certification
  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Certification Halal
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">
          Avez-vous une certification halal officielle ?
        </FormLabel>
        <RadioGroup
          value={certification.hasCertification}
          onChange={(e) => setCertification({ ...certification, hasCertification: e.target.value })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Oui" />
          <FormControlLabel value="no" control={<Radio />} label="Non, pas encore" />
        </RadioGroup>
      </FormControl>

      {certification.hasCertification === 'yes' && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Organisme certificateur</InputLabel>
            <Select
              value={certification.certifierId}
              label="Organisme certificateur"
              onChange={(e) => setCertification({ ...certification, certifierId: e.target.value })}
            >
              {certifiers.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
              <MenuItem value="other">Autre (non listé)</MenuItem>
            </Select>
          </FormControl>

          {certification.certifierId === 'other' && (
            <TextField
              label="Nom du certificateur"
              fullWidth
              sx={{ mb: 2 }}
              value={certification.customCertifierName}
              onChange={(e) => setCertification({ ...certification, customCertifierName: e.target.value })}
              helperText="Ce certificateur sera soumis à vérification"
            />
          )}

          <TextField
            label="Numéro de certification"
            fullWidth
            sx={{ mb: 2 }}
            value={certification.certificationNumber}
            onChange={(e) => setCertification({ ...certification, certificationNumber: e.target.value })}
            /*helperText={
              certification.certifierId && certification.certifierId !== 'other'
                ? `Format: ${certifiers.find(c => c.id === parseInt(certification.certifierId))?.format_regex || 'libre'}`
                : 'Entrez votre numéro de certification'
            }*/
          />
        </>
      )}

      {certification.hasCertification === 'no' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Vous pourrez ajouter votre certification plus tard depuis votre profil.
          Votre restaurant sera marqué comme "non certifié" jusqu'à validation.
        </Alert>
      )}
    </Box>
  );

  // Étape 3 - Conditions d'utilisation
  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Conditions d'utilisation et Charte Halal
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Veuillez lire attentivement les documents suivants avant de continuer.
      </Typography>

      {/* Lien vers les conditions */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          📄 Conditions d'utilisation
        </Typography>
        <Link 
          component={RouterLink} 
          to="/conditions-utilisation" 
          target="_blank"
          sx={{ fontSize: '0.9rem' }}
        >
          Lire les conditions d'utilisation →
        </Link>
      </Paper>

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            J'ai lu et j'accepte les conditions d'utilisation de la plateforme Bismillah.
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      {/* Lien vers la charte */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          🕌 Charte Éthique Halal
        </Typography>
        <Link 
          component={RouterLink} 
          to="/charte-halal" 
          target="_blank"
          sx={{ fontSize: '0.9rem' }}
        >
          Lire la charte halal →
        </Link>
      </Paper>

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedCharter}
            onChange={(e) => setAcceptedCharter(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            Je m'engage à respecter la charte éthique halal de Bismillah.
          </Typography>
        }
      />
    </Box>
  );

  // Étape 4 - Identité du restaurant
  const renderStep4 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Identité du restaurant
      </Typography>

      <TextField
        label="Nom du restaurant"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={identity.name}
        onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
        placeholder="Ex: Restaurant Le Délice"
      />

      {/* Upload logo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          Logo du restaurant (optionnel)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {identity.logoPreview && (
            <Box
              component="img"
              src={identity.logoPreview}
              alt="Aperçu logo"
              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2 }}
            />
          )}
          <Button variant="outlined" component="label">
            {identity.logo ? 'Changer le logo' : 'Ajouter un logo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Button>
        </Box>
      </Box>

      <TextField
        label="Numéro d'entreprise (BCE)"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={identity.company_number}
        onChange={(e) => setIdentity({ ...identity, company_number: e.target.value })}
        placeholder="BE0123456789"
        helperText="Format belge: BE suivi de 10 chiffres"
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type de restaurant</InputLabel>
        <Select
          value={identity.restaurantTypeId}
          label="Type de restaurant"
          onChange={(e) => setIdentity({ ...identity, restaurantTypeId: e.target.value })}
        >
          <MenuItem value="">
            <em>Sélectionner un type</em>
          </MenuItem>
          {restaurantTypes.map(type => (
            <MenuItem key={type.id} value={type.id}>
              {type.icon} {type.RestaurantTypeDescriptions?.[0]?.name || `Type ${type.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  // Étape 5 - Données de connexion
  const renderStep5 = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Données de connexion
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Cet email sera utilisé pour vous connecter et recevoir les notifications.
      </Alert>

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="restaurant@exemple.be"
      />

      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        helperText="Minimum 8 caractères"
      />

      <TextField
        label="Confirmer le mot de passe"
        type="password"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={credentials.confirmPassword}
        onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
        error={credentials.confirmPassword && credentials.password !== credentials.confirmPassword}
        helperText={
          credentials.confirmPassword && credentials.password !== credentials.confirmPassword
            ? 'Les mots de passe ne correspondent pas'
            : ''
        }
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={loading}
        sx={{ mt: 2, py: 1.5 }}
      >
        {loading ? 'Inscription en cours...' : 'Finaliser l\'inscription'}
      </Button>
    </Box>
  );

  // Étape 6 - Coordonnées
  const renderStep6 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

      <TextField
        label="Site web"
        fullWidth
        sx={{ mb: 2 }}
        value={contact.website}
        onChange={(e) => setContact({ ...contact, website: e.target.value })}
        placeholder="https://www.monrestaurant.be"
        InputProps={{
          startAdornment: <InputAdornment position="start">🌐</InputAdornment>
        }}
      />

      <TextField
        label="Téléphone"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.phone}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        placeholder="+32 2 123 45 67"
        InputProps={{
          startAdornment: <InputAdornment position="start">📞</InputAdornment>
        }}
      />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>
        Adresse du restaurant
      </Typography>

      {/* Autocomplétion ville */}
      <Autocomplete
        options={cityOptions}
        getOptionLabel={(option) => `${option.postal_code} - ${option.name}`}
        loading={cityLoading}
        value={selectedCity}
        onChange={(_, newValue) => setSelectedCity(newValue)}
        onInputChange={(_, newInputValue) => setCitySearch(newInputValue)}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Ville ou code postal"
            required
            sx={{ mb: 2 }}
            placeholder="Tapez un nom de ville ou code postal..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        noOptionsText="Aucune ville trouvée"
        loadingText="Recherche..."
      />

      <TextField
        label="Nom de la rue"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.streetName}
        onChange={(e) => setContact({ ...contact, streetName: e.target.value })}
        placeholder="Rue de Flandre"
      />

      <TextField
        label="Numéro"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.address_number}
        onChange={(e) => setContact({ ...contact, address_number: e.target.value })}
        placeholder="123A"
      />
    </Box>
  );

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

        {activeStep === 0 && renderStep1()}
        {activeStep === 1 && renderStep2()}
        {activeStep === 2 && renderStep3()}
        {activeStep === 3 && renderStep4()}
        {activeStep === 4 && renderStep6()}
        {activeStep === 5 && renderStep5()}

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
