'use client';

import { useState, useRef } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Event } from '@/types/event';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateUniqueEventCode } from '@/lib/utils/generateEventCode';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
    backgroundColor: '#ffffff',
    description: '',
    price: 0,
    seats: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const eventCode = await generateUniqueEventCode();
      
      // First create the event document without the image
      const newEvent: Omit<Event, 'id'> = {
        ...formData,
        status: 'draft',
        owner: userId,
        code: eventCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create the event document first
      await setDoc(doc(db, 'events', eventCode), newEvent);

      // Then handle image upload if there is one
      let imageUrl = '';
      if (selectedImage) {
        const imageRef = ref(storage, `events/${eventCode}/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(imageRef);
        
        // Update the event document with the image URL
        await updateDoc(doc(db, 'events', eventCode), {
          imageUrl,
          updatedAt: new Date()
        });
      }
      
      // Reset form with new default dates
      const newDefaultDates = getDefaultDates();
      setFormData({
        name: '',
        venue: '',
        startDate: newDefaultDates.startDate,
        startTime: newDefaultDates.startTime,
        endDate: newDefaultDates.endDate,
        endTime: newDefaultDates.endTime,
        backgroundColor: '#ffffff',
        description: '',
        price: 0,
        seats: 0,
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsOpen(false); // Close the form after successful submission
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h2 className="text-2xl font-semibold">Opret nyt arrangement</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
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

              <div className="space-y-2 md:col-span-2">
                <Label>Event Billede</Label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  disabled={loading}
                />
                <div 
                  onClick={handleImageClick}
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                >
                  {previewUrl ? (
                    <div className="relative w-full aspect-video">
                      <Image
                        src={previewUrl}
                        alt="Event preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p>Klik for at vælge et billede</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-16 h-10 p-1"
                    disabled={loading}
                  />
                  <Input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    placeholder="#ffffff"
                    className="flex-1"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Pris (DKK)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Antal pladser</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 0 })}
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
              {loading ? 'Opretter arrangement...' : 'Opret arrangement'}
            </Button>
          </form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AddEventForm;