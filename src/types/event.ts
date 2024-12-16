import { Timestamp } from "firebase/firestore";

export type EventStatus = 'draft' | 'active' | 'cancelled' | 'ended';

export interface Event {
  id: string;
  owner: string;
  code: string;
  name: string;
  description?: string;
  venue: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  seats?: number;
  price?: number;
  imageUrl?: string;
  backgroundColor?: string;
  status: 'active' | 'cancelled' | 'draft' | 'ended';
  userId: string;
  successText?: string;
  paymentMessage?: string;
  public: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 