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
import PrintIcon from '../../../../../../public/print-light.svg';   
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import pagesContent from '@/app/content/pages';

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
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [guestListExpanded, setGuestListExpanded] = useState(true);
  const lang = useLanguage();
  const content = pagesContent[lang as keyof typeof pagesContent].eventDetails;

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
    return <div>{content.loading}</div>;
  }

  const handleDelete = async () => {
    if (!window.confirm(content.confirmDelete)) {
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
      alert(content.deleteError);
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
              <CardTitle>{content.eventDetails}</CardTitle>
              <button onClick={() => setDetailsExpanded(!detailsExpanded)}>
                {detailsExpanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            </CardHeader>
            {detailsExpanded && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Event Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{content.eventCode}</h3>
                      <p className="font-mono">{event.code}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.name}</h3>
                      <p>{event.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.description}</h3>
                      <p className="whitespace-pre-wrap">{event.description || content.noDescription}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.price}</h3>
                      <p>{event.price} DKK</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.availableSeats}</h3>
                      <p>{event.seats}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.backgroundColor}</h3>
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
                      <h3 className="font-semibold">{content.start}</h3>
                      <p>{event.startDate} at {event.startTime}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.end}</h3>
                      <p>{event.endDate} at {event.endTime}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.venue}</h3>
                      <p>{event.venue}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.status}</h3>
                      <p>{event.status}</p>
                    </div>
                    {event.imageUrl && (
                      <div>
                        <h3 className="font-semibold mb-2">{content.eventImage}</h3>
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
            )}
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{content.guestList} ({guests.length})</CardTitle>
              <button onClick={() => setGuestListExpanded(!guestListExpanded)}>
                {guestListExpanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            </CardHeader>
            {guestListExpanded && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{content.name}</TableHead>
                      <TableHead>{content.email}</TableHead>
                      <TableHead>{content.registeredAt}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.name}</TableCell>
                        <TableCell>{guest.email}</TableCell>
                        <TableCell>
                          {guest.createdAt ? new Date(guest.createdAt).toLocaleString() : content.notAvailable}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
} 