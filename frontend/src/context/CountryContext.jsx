import React, { createContext, useContext, useState } from 'react';

// Crée le contexte pour le pays courant (iso_code)
const CountryContext = createContext();

/**
 * CountryProvider
 * Fournit le pays courant (iso_code) à toute l'application
 * Utilisation :
 * <CountryProvider> ... </CountryProvider>
 */
export const CountryProvider = ({ children, defaultCountry = 'BE' }) => {
  const [countryIsoCode, setCountryIsoCode] = useState(defaultCountry);
  return (
    <CountryContext.Provider value={{ countryIsoCode, setCountryIsoCode }}>
      {children}
    </CountryContext.Provider>
  );
};

/**
 * Hook pour accéder au pays courant
 * const { countryIsoCode, setCountryIsoCode } = useCountry();
 */
export const useCountry = () => useContext(CountryContext);
