'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';
import { Guest } from '@/types/guest';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EventQRCode from './components/EventQRCode';

export default function EventDetailsPage({ params }: { params: { code: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchEventAndGuests = async () => {
      try {
        const eventRef = doc(db, 'events', params.code);
        const eventDoc = await getDoc(eventRef);

        if (!eventDoc.exists() || eventDoc.data().owner !== user.uid) {
          router.push('/dashboard');
          return;
        }

        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);

        // Subscribe to guests collection
        const guestsQuery = query(collection(db, 'events', params.code, 'guests'));
        const unsubscribe = onSnapshot(guestsQuery, (snapshot) => {
          const guestsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Guest[];
          setGuests(guestsList);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching event details:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndGuests();
  }, [params.code, user, router]);

  if (loading || !event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8">
                {/* Event Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Event Code</h3>
                    <p className="font-mono">{event.code}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Name</h3>
                    <p>{event.name}</p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Start</h3>
                    <p>{event.startDate} at {event.startTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">End</h3>
                    <p>{event.endDate} at {event.endTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Venue</h3>
                    <p>{event.venue}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <p>{event.status}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center">
                  <EventQRCode eventCode={event.code} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest List ({guests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>{guest.name}</TableCell>
                      <TableCell>{guest.email}</TableCell>
                      <TableCell>
                        {guest.createdAt ? new Date(guest.createdAt).toLocaleString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 