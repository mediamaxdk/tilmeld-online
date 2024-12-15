'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GuestForm from './components/GuestForm';

export default function EventPage({ params }: { params: { code: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, 'events', params.code.toUpperCase());
        const eventDoc = await getDoc(eventRef);

        if (!eventDoc.exists() || eventDoc.data().status !== 'active') {
          notFound();
          return;
        }

        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
      } catch (error) {
        console.error('Error fetching event:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Venue</h3>
                <p>{event.venue}</p>
              </div>
              <div>
                <h3 className="font-semibold">Date & Time</h3>
                <p>Starts: {event.startDate} at {event.startTime}</p>
                <p>Ends: {event.endDate} at {event.endTime}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Register for this event</CardTitle>
            </CardHeader>
            <CardContent>
              <GuestForm eventCode={event.code} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 