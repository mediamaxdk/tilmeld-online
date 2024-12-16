export type EventStatus = 'draft' | 'active' | 'cancelled' | 'ended';

export interface Event {
  id?: string;
  code: string;
  name: string;
  venue: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: EventStatus;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
  backgroundColor?: string;
  description?: string;
  price: number;
  seats: number;
  imageUrl?: string;
} 