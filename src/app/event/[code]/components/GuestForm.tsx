'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Guest } from '@/types/guest';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestFormProps {
  eventCode: string;
}

const GuestForm = ({ eventCode }: GuestFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const guestData: Omit<Guest, 'id'> = {
        ...formData,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'events', eventCode, 'guests'), guestData);
      setSuccess(true);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Error registering for event:', error);
      setError('Failed to register for event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <p className="text-green-600">Successfully registered for the event!</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register for Event'}
      </Button>
    </form>
  );
};

export default GuestForm; 