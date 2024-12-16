'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { Event } from '@/types/event';
import { Guest } from '@/types/guest';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use } from 'react';
import Header from "@/app/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ref, deleteObject, listAll } from 'firebase/storage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EventQRCode from './components/EventQRCode';
import Image from 'next/image';

type Props = {
  params: Promise<{ code: string }>;
};

export default function EventDetailsPage({ params }: Props) {
  const resolvedParams = use(params);
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
        const eventRef = doc(db, 'events', resolvedParams.code);
        const eventDoc = await getDoc(eventRef);

        if (!eventDoc.exists() || eventDoc.data().owner !== user.uid) {
          router.push('/dashboard');
          return;
        }

        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);

        const guestsQuery = query(collection(db, 'events', resolvedParams.code, 'guests'));
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
  }, [resolvedParams.code, user, router]);

  if (loading || !event) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);

      // Delete all guest documents
      const guestsQuery = query(collection(db, 'events', event.code, 'guests'));
      const guestsSnapshot = await getDocs(guestsQuery);
      const deleteGuestsPromises = guestsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deleteGuestsPromises);

      // Delete all files in the event's storage folder
      const storageRef = ref(storage, `events/${event.code}`);
      const filesList = await listAll(storageRef);
      const deleteFilesPromises = filesList.items.map(item => 
        deleteObject(item)
      );
      await Promise.all(deleteFilesPromises);

      // Delete the event document
      await deleteDoc(doc(db, 'events', event.code));

      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Details</CardTitle>
              {event.status === 'cancelled' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Event
                </Button>
              )}
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
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p className="whitespace-pre-wrap">{event.description || 'No description'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Price</h3>
                    <p>{event.price} DKK</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Available Seats</h3>
                    <p>{event.seats}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Background Color</h3>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: event.backgroundColor }}
                      />
                      <span className="font-mono">{event.backgroundColor}</span>
                    </div>
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
                  {event.imageUrl && (
                    <div>
                      <h3 className="font-semibold mb-2">Event Image</h3>
                      <div className="relative w-full aspect-video">
                        <Image
                          src={event.imageUrl}
                          alt={event.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}
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