'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GuestForm from './components/GuestForm';
import Image from 'next/image';

type Props = {
  params: Promise<{ code: string }>;
};

export default function EventPage({ params }: Props) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, 'events', resolvedParams.code.toUpperCase());
        const eventDoc = await getDoc(eventRef);

        if (!eventDoc.exists() || eventDoc.data().status !== 'active') {
          notFound();
          return;
        }

        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);

        // Only fetch guest count if seats is defined and valid
        const eventData = eventDoc.data();
        if (typeof eventData.seats === 'number' && !isNaN(eventData.seats)) {
          const guestsRef = collection(db, 'events', resolvedParams.code.toUpperCase(), 'guests');
          const guestsSnapshot = await getDocs(query(guestsRef));
          setGuestCount(guestsSnapshot.size);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedParams.code]);

  if (loading) {
    return <div>Indlæser...</div>;
  }

  if (!event) {
    return notFound();
  }

  const hasValidSeats = typeof event.seats === 'number' && !isNaN(event.seats);
  const hasValidPrice = typeof event.price === 'number' && !isNaN(event.price);
  const availableSeats = hasValidSeats ? event.seats - guestCount : 0;
  const isSoldOut = hasValidSeats && availableSeats <= 0;

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: event.backgroundColor || '#ffffff' }}
    >
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {event.imageUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl">{event.name}</CardTitle>
              {event.description && (
                <p className="mt-2 text-gray-600">{event.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Lokation</h3>
                <p>{event.venue}</p>
              </div>
              <div>
                <h3 className="font-semibold">Dato & Tidspunkt</h3>
                <p>Starter: {event.startDate} kl. {event.startTime}</p>
                <p>Slutter: {event.endDate} kl. {event.endTime}</p>
              </div>
              {hasValidPrice && (
                <div>
                  <h3 className="font-semibold">Pris</h3>
                  <p>{event.price === 0 ? 'Gratis' : `${event.price} DKK`}</p>
                </div>
              )}
              {hasValidSeats && (
                <div>
                  <h3 className="font-semibold">Ledige pladser</h3>
                  <p className={isSoldOut ? 'text-red-500 font-semibold' : ''}>
                    {isSoldOut ? 'Udsolgt' : `${availableSeats} af ${event.seats} pladser tilbage`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {hasValidSeats ? (
            !isSoldOut ? (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Tilmeld dig dette arrangement</CardTitle>
                </CardHeader>
                <CardContent>
                  <GuestForm eventCode={event.code} availableSeats={availableSeats} />
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Tilmelding lukket</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Dette arrangement er desværre udsolgt.</p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tilmeld dig dette arrangement</CardTitle>
              </CardHeader>
              <CardContent>
                <GuestForm eventCode={event.code} availableSeats={Infinity} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
} 