'use client';

import { useState, useEffect } from 'react';

export function useLanguage() {
  const [lang, setLang] = useState('da');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    setLang(browserLang === 'da' ? 'da' : 'en');
  }, []);

  return lang;
} 