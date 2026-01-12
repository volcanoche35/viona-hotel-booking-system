
import React from 'react';
import { Room, RoomCategory, SiteConfig } from './types';
import {
  Waves,
  Tv,
  Refrigerator,
  ShieldCheck,
  Wind,
  Wifi
} from 'lucide-react';

export const AMENITIES_MAP: Record<string, { name: string; icon: React.ReactNode }> = {
  sea_view: { name: 'Sea View', icon: <Waves className="w-4 h-4" /> },
  led_tv: { name: 'Led TV', icon: <Tv className="w-4 h-4" /> },
  minibar: { name: 'Minibar', icon: <Refrigerator className="w-4 h-4" /> },
  safe: { name: 'Safe Box', icon: <ShieldCheck className="w-4 h-4" /> },
  ac: { name: 'AC', icon: <Wind className="w-4 h-4" /> },
  wifi: { name: 'Free Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
};

const DEFAULT_AMENITIES = ['sea_view', 'led_tv', 'minibar', 'safe', 'ac', 'wifi'];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  hero: {
    tag: {
      en: "Experience Luxury in Narlıdere",
      tr: "Narlıdere'de Lüksü Deneyimleyin",
      de: "Erleben Sie Luxus in Narlıdere"
    },
    title: {
      en: "Your Coastal Sanctuary Awaits",
      tr: "Sahil Sığınağınız Sizi Bekliyor",
      de: "Ihr Refugium an der Küste"
    },
    subtitle: {
      en: "Where the Aegean sun meets modern comfort. A 17-room boutique experience designed for peace and elegance.",
      tr: "Ege güneşinin modern konforla buluştuğu nokta. Huzur ve zarafet için tasarlanmış 17 odalı bir butik deneyim.",
      de: "Wo die ägäische Sonne auf modernen Komfort trifft. Ein Boutique-Erlebnis mit 17 Zimmern, entworfen für Ruhe und Eleganz."
    },
    image: "/viona-hero.jpg" // Yeni resepsiyon arka planı
  },
  about: {
    title: {
      en: "Quiet Luxury, Aegean Style",
      tr: "Sessiz Lüks, Ege Tarzı",
      de: "Ruhiger Luxus, ägäischer Stil"
    },
    subtitle: {
      en: "Reception & Lobby",
      tr: "Resepsiyon ve Lobi",
      de: "Rezeption & Lobby"
    },
    philosophy: {
      en: "Our lobby captures the freshness of the Aegean, and our reception radiates professional warmth. Viona Hotel is more than a stay; it is an architecture of serenity.",
      tr: "Lobimizde Ege'nin ferahlığını, resepsiyonumuzda profesyonelliğin sıcaklığını hissedeceksiniz. Viona Hotel, bir konaklamadan fazı, bir sükunet mimarisidir.",
      de: "Unsere Lobby fängt die Frische der Ägäis ein, und unsere Rezeption strahlt professionelle Wärme aus. Das Viona Hotel ist mehr als nur ein Aufenthalt; es ist eine Architektur der Gelassenheit."
    },
    image1: "/about-lobby-1.jpg",
    image2: "/about-view-1.jpg"
  },
  rooms: [
    {
      id: 'cat_suite',
      name: { en: 'Executive Sea Suite', tr: 'Executive Deniz Süit', de: 'Executive Meeressuite' },
      category: RoomCategory.SUITE,
      price: 450,
      description: {
        en: "Experience the ultimate Aegean escape with panoramic sea views from your bed. Modern luxury meets coastal peace.",
        tr: "Yatağınızdan panoramik deniz manzarasının keyfini çıkarın. Modern lüksün kıyı huzuruyla buluştuğu nokta.",
        de: "Erleben Sie die ultimative ägäische Flucht mit Panoramablick aufs Meer direkt von Ihrem Bett aus."
      },
      image: '/room-suite-1.jpg',
      gallery: ['/room-suite-2.png', '/viona-hero.jpg'],
      amenities: DEFAULT_AMENITIES,
    },
    {
      id: 'cat_double',
      name: { en: 'Deluxe Garden Room', tr: 'Deluxe Bahçe Odası', de: 'Deluxe Gartenzimmer' },
      category: RoomCategory.DOUBLE,
      price: 280,
      description: {
        en: "Spacious and bright, featuring a large balcony and sophisticated wooden details for a warm atmosphere.",
        tr: "Geniş ve aydınlık, büyük bir balkon ve sıcak bir atmosfer için sofistike ahşap detaylarla donatılmış.",
        de: "Geräumig und hell, mit einem großen Balkon und anspruchsvollen Holzdetails für eine warme Atmosphäre."
      },
      image: '/room-double-1.png',
      gallery: ['/about-lobby-1.jpg', '/about-view-1.jpg'],
      amenities: DEFAULT_AMENITIES,
    },
    {
      id: 'cat_twin',
      name: { en: 'Classic Twin Comfort', tr: 'Klasik İkiz Konfor', de: 'Klassischer Twin-Komfort' },
      category: RoomCategory.TWIN,
      price: 240,
      description: {
        en: "Perfectly arranged twin beds with high-end linens and a functional desk area for productivity.",
        tr: "Yüksek kaliteli nevresimler ve verimlilik için fonksiyonel bir çalışma masası alanı ile mükemmel düzenlenmiş ikiz yataklar.",
        de: "Perfekt arrangierte Einzelbetten mit hochwertiger Bettwäsche und einem funktionalen Schreibtischbereich."
      },
      image: '/room-double-1.png',
      gallery: ['/about-view-1.jpg'],
      amenities: DEFAULT_AMENITIES,
    }
  ]
};

export const CATEGORY_COUNTS = {
  [RoomCategory.SUITE]: 1,
  [RoomCategory.DOUBLE]: 12,
  [RoomCategory.TWIN]: 4
};
