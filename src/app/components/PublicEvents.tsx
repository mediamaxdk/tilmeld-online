'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

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
            <div key={event.id} className="flex flex-col h-full">
              <Link href={`/events/${event.id}`}>
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover mb-4"
                />
              </Link>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 