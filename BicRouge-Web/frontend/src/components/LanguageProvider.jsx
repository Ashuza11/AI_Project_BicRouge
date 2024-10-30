import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'fr'; 
    i18n.changeLanguage(storedLanguage);
  }, [i18n]);

  return <>{children}</>; 
};

export default LanguageProvider;
