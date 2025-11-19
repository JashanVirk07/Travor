// src/types/index.ts
import { Timestamp } from 'firebase/firestore';

export type Role = 'traveler' | 'guide' | 'admin';

export interface User {
  uid: string;
  email: string;
  role: Role;
  name: string;
  verified?: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface GuideProfile {
  guideId: string;
  userId: string;
  displayName?: string;
  bio: string;
  location: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  toursCompleted: number;
  isVerified: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface Tour {
  tourId: string;
  guideId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[]; // array of urls
  duration: string;
  maxParticipants?: number;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  bookings: number;
  category?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface Booking {
  bookingId: string;
  travelerId: string;
  guideId: string;
  tourId: string;

  // normalized field names used in services
  startDate: string; // or Date string/ISO — keep consistent in UI
  numberOfParticipants: number;

  ticketNumber?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'completed' | 'failed';

  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  completedAt?: Timestamp | null;
}

export interface Payment {
  paymentId: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: Timestamp | null;
  processedAt?: Timestamp | null;
}

export interface Review {
  reviewId: string;
  bookingId?: string;
  travelerId: string;
  guideId: string;
  tourId?: string;
  rating: number;
  comment?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface Message {
  messageId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  isRead?: boolean;
  timestamp?: Timestamp | null;
}
