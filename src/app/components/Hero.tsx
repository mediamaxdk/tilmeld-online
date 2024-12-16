'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '@/hooks/useLanguage';

const content = {
  da: {
    title: 'Find event via kode:',
    placeholder: 'KODE',
    loading: 'Søger...',
    error: {
      notFound: 'Event ikke fundet',
      notActive: 'Dette event er ikke aktivt',
      generic: 'Fejl ved opslag af event'
    }
  },
  en: {
    title: 'Find event by code:',
    placeholder: 'CODE',
    loading: 'Searching...',
    error: {
      notFound: 'Event not found',
      notActive: 'This event is not currently active',
      generic: 'Error looking up event'
    }
  }
};

export default function Hero() {
  const [eventCode, setEventCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const lang = useLanguage();
  const t = content[lang as keyof typeof content];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventRef = doc(db, 'events', eventCode.toUpperCase());
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        setError(t.error.notFound);
        return;
      }

      const eventData = eventDoc.data();
      if (eventData.status !== 'active') {
        setError(t.error.notActive);
        return;
      }

      router.push(`/event/${eventCode}`);
    } catch (error) {
      setError(t.error.generic);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-lime-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-center mb-8">
          {t.title}
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center justify-center gap-4">
          <Input
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            className="text-center uppercase font-bold h-16 w-48 tracking-wider border-black"
            style={{ fontSize: '2rem', borderWidth: '2px' }}
            maxLength={6}
            required
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-16 w-16 flex-shrink-0" 
            disabled={loading}
          >
            <Image 
              src="/magnifying-glass-solid.svg" 
              alt="Search" 
              width={24} 
              height={24} 
              className="invert"
            />
          </Button>
        </form>
        {error && (
          <p className="text-sm text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </section>
  );
}

