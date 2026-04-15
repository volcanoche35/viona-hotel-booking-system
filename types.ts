
import { Language } from './translations';

// Oda kategorileri: Deniz ve Kara manzaralı
export enum RoomCategory {
  SEA_VIEW = 'Deniz Manzaralı',
  LAND_VIEW = 'Kara Manzaralı'
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: Record<Language, string>;
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

// Yeni: Rezervasyon Talebi (ödeme bilgisi yok)
export interface ReservationRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredRoomCategory: RoomCategory;
  checkIn: string;
  checkOut: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// Yeni: Bloke edilmiş tarihler (admin tarafından)
export interface BlockedDate {
  id: string;
  roomCategory: RoomCategory;
  date: string;
  reason?: string;
}

// Eski Booking interface'i korunuyor (geriye dönük uyumluluk)
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
    slides: HeroSlide[];
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
