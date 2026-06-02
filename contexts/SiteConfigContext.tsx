import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { SITE_CONFIG as DEFAULT_CONFIG } from '../config/site-config';

interface SiteConfigContextType {
  config: typeof DEFAULT_CONFIG;
  loading: boolean;
  reloadConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: DEFAULT_CONFIG,
  loading: true,
  reloadConfig: async () => {}
});

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    setLoading(true);
    const data = await DataService.getGlobalSettings();
    if (data) {
      // Merge with default to ensure no missing fields break the UI
      setConfig(prev => ({ ...prev, ...data }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading, reloadConfig: loadConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};
