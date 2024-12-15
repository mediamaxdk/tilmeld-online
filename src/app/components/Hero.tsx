'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Hero() {
  const [eventCode, setEventCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventRef = doc(db, 'events', eventCode.toUpperCase());
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        setError('Event not found');
        return;
      }

      const eventData = eventDoc.data();
      if (eventData.status !== 'active') {
        setError('This event is not currently active');
        return;
      }

      router.push(`/event/${eventCode}`);
    } catch (error) {
      setError('Error looking up event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Velkommen til Tilmeld.Online!</h1>
        <p className="text-xl mb-8">Nem tilmelding til arrangementer og events</p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            placeholder="Enter event code"
            className="text-center uppercase"
            maxLength={6}
            required
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Looking up event...' : 'Find Event'}
          </Button>
        </form>
      </div>
    </section>
  );
}

