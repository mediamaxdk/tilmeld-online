'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [browserLang, setBrowserLang] = useState('');

  useEffect(() => {
    const lang = navigator.language;
    setBrowserLang(lang);
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-gray-600">
            © 2024 MediaMax ApS
          </p>
          <p className="text-xs text-gray-400">
            {browserLang}
          </p>
        </div>
      </div>
    </footer>
  );
}
  
  