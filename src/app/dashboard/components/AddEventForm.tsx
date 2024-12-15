'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateUniqueEventCode } from '@/lib/utils/generateEventCode';

interface AddEventFormProps {
  userId: string;
}

const getDefaultDates = () => {
  const now = new Date();
  const startDate = now.toISOString().split('T')[0];
  
  // Format current time HH:mm
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const startTime = `${hours}:${minutes}`;
  
  // Add 1 hour for end time
  const endDate = startDate;
  const endTime = `${(now.getHours() + 1).toString().padStart(2, '0')}:${minutes}`;
  
  return {
    startDate,
    startTime,
    endDate,
    endTime,
  };
};

const AddEventForm = ({ userId }: AddEventFormProps) => {
  const defaultDates = getDefaultDates();
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    startDate: defaultDates.startDate,
    startTime: defaultDates.startTime,
    endDate: defaultDates.endDate,
    endTime: defaultDates.endTime,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const eventCode = await generateUniqueEventCode();
      
      const newEvent: Omit<Event, 'id'> = {
        ...formData,
        status: 'draft',
        owner: userId,
        code: eventCode,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'events', eventCode), newEvent);
      
      // Reset form with new default dates
      const newDefaultDates = getDefaultDates();
      setFormData({
        name: '',
        venue: '',
        startDate: newDefaultDates.startDate,
        startTime: newDefaultDates.startTime,
        endDate: newDefaultDates.endDate,
        endTime: newDefaultDates.endTime,
      });
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating Event...' : 'Add Event'}
      </Button>
    </form>
  );
};

export default AddEventForm;