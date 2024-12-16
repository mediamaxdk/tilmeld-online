'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';
import Link from 'next/link';
import Image from 'next/image';

export default function PublicEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const now = new Date();
        const eventsRef = collection(db, 'events');
        const q = query(
          eventsRef,
          where('public', '==', true),
          where('status', '==', 'active'),
          where('startDate', '>=', now.toISOString().split('T')[0]),
          orderBy('startDate', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching public events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Kommende arrangementer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/event/${event.code}`} className="group">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                  <h3 className="text-white font-semibold text-lg">{event.name}</h3>
                  <p className="text-white/90 text-sm">{event.venue}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-600">
                  {event.startDate} kl. {event.startTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 