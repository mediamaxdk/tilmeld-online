'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Guest } from '@/types/guest';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestFormProps {
  eventCode: string;
  availableSeats: number;
  successText?: string;
  paymentMessage?: string;
}

const GuestForm = ({ eventCode, availableSeats, successText, paymentMessage }: GuestFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const checkExistingEmail = async (email: string): Promise<boolean> => {
    const guestsRef = collection(db, 'events', eventCode, 'guests');
    const q = query(guestsRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Check if seats are available
      if (availableSeats <= 0) {
        setError('Dette arrangement er desværre udsolgt.');
        setLoading(false);
        return;
      }

      // Check if email already exists
      const emailExists = await checkExistingEmail(formData.email);
      if (emailExists) {
        setError('Denne e-mail er allerede tilmeldt dette arrangement.');
        setLoading(false);
        return;
      }

      const guestData: Omit<Guest, 'id'> = {
        ...formData,
        email: formData.email.toLowerCase(), // Store email in lowercase
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'events', eventCode, 'guests'), guestData);
      setSuccess(true);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Error registering for event:', error);
      setError('Der opstod en fejl ved tilmelding. Prøv venligst igen.');
    } finally {
      setLoading(false);
    }
  };

  if (availableSeats <= 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <p className="text-green-600">{successText || 'Du er nu tilmeldt arrangementet!'}</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Navn</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
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
        {loading ? 'Tilmelder...' : 'Tilmeld'}
      </Button>

      {paymentMessage && (
        <div className="mt-2 text-gray-600">
          <p>{paymentMessage}</p>
        </div>
      )}
    </form>
  );
};

export default GuestForm; 