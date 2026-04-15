
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

const DEFAULT_AMENITIES = ['led_tv', 'minibar', 'safe', 'ac', 'wifi'];
const SEA_VIEW_AMENITIES = ['sea_view', ...DEFAULT_AMENITIES];

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
      en: "Where the Aegean sun meets modern comfort. A 20-room boutique experience designed for peace and elegance.",
      tr: "Ege güneşinin modern konforla buluştuğu nokta. Huzur ve zarafet için tasarlanmış 20 odalı bir butik deneyim.",
      de: "Wo die ägäische Sonne auf modernen Komfort trifft. Ein Boutique-Erlebnis mit 20 Zimmern, entworfen für Ruhe und Eleganz."
    },
    image: `${import.meta.env.BASE_URL}viona-hero.jpg`,
    slides: [
      { id: 'slide1', type: 'image', url: `${import.meta.env.BASE_URL}viona-hero.jpg` },
      { id: 'slide2', type: 'image', url: `${import.meta.env.BASE_URL}photo/viona-sunset-reception.jpg` }
    ]
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
      tr: "Lobimizde Ege'nin ferahlığını, resepsiyonumuzda profesyonelliğin sıcaklığını hissedeceksiniz. Viona Hotel, bir konaklamadan fazlası, bir sükunet mimarisidir.",
      de: "Unsere Lobby fängt die Frische der Ägäis ein, und unsere Rezeption strahlt professionelle Wärme aus. Das Viona Hotel ist mehr als nur ein Aufenthalt; es ist eine Architektur der Gelassenheit."
    },
    image1: `${import.meta.env.BASE_URL}photo/361158b8-8b39-4adf-941b-589e3a4a06cb-1024.webp`,
    image2: `${import.meta.env.BASE_URL}photo/8c450882-60d3-4414-a224-9a3ff50ddec2-1024.webp`
  },
  rooms: [
    {
      id: 'room_sea_view',
      name: { en: 'Standard Sea View Room', tr: 'Standart Deniz Manzaralı Oda', de: 'Standard Zimmer mit Meerblick' },
      category: RoomCategory.SEA_VIEW,
      price: 350,
      description: {
        en: "Wake up to the calming blues of the Aegean Sea. Our sea view rooms offer panoramic views from your private balcony.",
        tr: "Ege Denizi'nin dinlendirici mavilerine uyanın. Deniz manzaralı odalarımız özel balkonunuzdan panoramik manzara sunar.",
        de: "Wachen Sie mit dem beruhigenden Blau der Ägäis auf. Unsere Zimmer mit Meerblick bieten Panoramablick von Ihrem privaten Balkon."
      },
      image: `${import.meta.env.BASE_URL}photo/278bb20e-48d6-4978-99e5-95b4af534337-1024.webp`,
      gallery: [`${import.meta.env.BASE_URL}photo/8c450882-60d3-4414-a224-9a3ff50ddec2-1024.webp`, `${import.meta.env.BASE_URL}photo/82c71c92-cdb2-4541-8a36-8c169513bccf-1024.webp`],
      amenities: SEA_VIEW_AMENITIES,
    },
    {
      id: 'room_land_view',
      name: { en: 'Standard Land View Room', tr: 'Standart Kara Manzaralı Oda', de: 'Standard Zimmer mit Gartenblick' },
      category: RoomCategory.LAND_VIEW,
      price: 280,
      description: {
        en: "Surrounded by Mediterranean greenery, our garden view rooms offer a peaceful retreat with lush views.",
        tr: "Akdeniz yeşilliğiyle çevrili bahçe manzaralı odalarımız, yemyeşil manzarayla huzurlu bir kaçış sunar.",
        de: "Umgeben von mediterranem Grün bieten unsere Zimmer mit Gartenblick einen friedlichen Rückzugsort mit üppiger Aussicht."
      },
      image: `${import.meta.env.BASE_URL}photo/11b7e4de-ebeb-43cc-8b65-1d29565263c1-1024.webp`,
      gallery: [`${import.meta.env.BASE_URL}photo/2b86519c-456b-449d-b29b-e02a707846b5-1024.webp`, `${import.meta.env.BASE_URL}photo/361158b8-8b39-4adf-941b-589e3a4a06cb-1024.webp`],
      amenities: DEFAULT_AMENITIES,
    }
  ]
};

// 20 odalı butik otel: 10 Deniz, 10 Kara manzaralı
export const CATEGORY_COUNTS: Record<RoomCategory, number> = {
  [RoomCategory.SEA_VIEW]: 10,
  [RoomCategory.LAND_VIEW]: 10
};

// 3. Parti Rezervasyon Linkleri
export const THIRD_PARTY_LINKS = {
  booking: 'https://www.booking.com/hotel/tr/viona-hotel.html', // Kullanıcı güncelleyecek
  expedia: 'https://www.expedia.com/Izmir-Hotels-Viona-Hotel.html', // Kullanıcı güncelleyecek
  trivago: null // Opsiyonel
};

