'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventStatus } from '@/types/event';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EventsListProps {
  userId: string;
}

const EventsList = ({ userId }: EventsListProps) => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      where('owner', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(eventsList);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      status: newStatus,
      updatedAt: new Date()
    });
  };

  const handleRowClick = (eventCode: string) => {
    router.push(`/dashboard/events/${eventCode}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow 
            key={event.code}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleRowClick(event.code)}
          >
            <TableCell className="font-mono">{event.code}</TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>{event.venue}</TableCell>
            <TableCell>
              {event.startDate} {event.startTime}
            </TableCell>
            <TableCell>
              {event.endDate} {event.endTime}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Select
                value={event.status}
                onValueChange={(value: EventStatus) => 
                  handleStatusChange(event.code, value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventsList;