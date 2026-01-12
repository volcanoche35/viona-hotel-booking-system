
import { Language } from './translations';

export enum RoomCategory {
  SUITE = 'Suite',
  DOUBLE = 'Double',
  TWIN = 'Twin'
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  name: Record<Language, string>;
  category: RoomCategory;
  price: number;
  description: Record<Language, string>;
  image: string;
  gallery: string[];
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomCategory: RoomCategory;
  checkIn: string;
  checkOut: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  createdAt: string;
}

export interface SiteConfig {
  hero: {
    tag: Record<Language, string>;
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    image: string;
  };
  about: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    philosophy: Record<Language, string>;
    image1: string;
    image2: string;
  };
  rooms: Room[];
}
