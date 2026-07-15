import { useEffect, useState } from 'react';
import { getSettings } from '../lib/catalogApi';

const fallbackSettings = {
  store_name: 'Aurora Catalogo',
  whatsapp_number: '51942346985',
  instagram_url: 'https://www.instagram.com/au.rora_pe/',
  currency: 'S/',
  default_whatsapp_message: 'Hola, me interesa consultar disponibilidad y coordinar una compra.'
};

export const useSettings = () => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSettings();
        if (isMounted && data) {
          setSettings({ ...fallbackSettings, ...data });
        }
      } catch (err) {
        if (isMounted) setError(err.message);
        console.error('Error al cargar configuracion:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading, error };
};
