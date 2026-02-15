import { useState, useCallback, useEffect } from "react";
import { apiUrl } from '../config/api';

/**
 * Hook personnalisé pour la recherche de villes avec debounce
 * @returns { cityOptions, cityLoading, setCitySearch }
 */
export default function useCitySearch() {
  const [citySearch, setCitySearch] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const searchCities = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setCityOptions([]);
      return;
    }
    setCityLoading(true);
    try {
      const res = await fetch(apiUrl(`/cities/search?q=${encodeURIComponent(query)}`));
      const data = await res.json();
      setCityOptions(data);
    } catch (error) {
      setCityOptions([]);
    } finally {
      setCityLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (citySearch.length >= 2) {
        searchCities(citySearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, searchCities]);

  return { cityOptions, cityLoading, setCitySearch };
}
