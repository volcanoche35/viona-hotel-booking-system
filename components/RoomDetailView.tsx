
import React from 'react';
import { Room, RoomCategory } from '../types';
import { Language, translations } from '../translations';
import { AMENITIES_MAP } from '../constants';
import { LazyImage } from './LazyImage';
import { 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  MapPin, 
  Star,
  ShieldCheck
} from 'lucide-react';

interface RoomDetailViewProps {
  room: Room;
  onBack: () => void;
  onBook: () => void;
  lang: Language;
}

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({ room, onBack, onBook, lang }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-700">
      {/* Header / Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 z-50 p-4 bg-white/20 backdrop-blur-xl text-white rounded-full hover:bg-white hover:text-viona-text transition-all shadow-2xl border border-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <LazyImage
          src={room.image} 
          className="w-full h-full object-cover scale-105" 
          alt={room.name[lang]}
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-16 left-8 right-8 max-w-7xl mx-auto text-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-viona-accent text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              {room.category}
            </span>
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif leading-none mb-4">{room.name[lang]}</h1>
          <div className="flex items-center gap-6 text-sm opacity-80 font-medium">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Narlıdere, İzmir</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Viona Certified</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            {/* Description */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-viona-text">About the Experience</h2>
              <p className="text-viona-text/70 text-lg leading-relaxed max-w-2xl italic font-light">
                "{room.description[lang]}"
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10">
                {room.amenities.map(key => {
                  const amenity = AMENITIES_MAP[key];
                  if (!amenity) return null;
                  return (
                    <div key={key} className="flex items-center gap-4 p-4 bg-viona-bg/30 rounded-2xl border border-viona-bg/50">
                      <div className="text-viona-accent">{amenity.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-viona-text">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-viona-text">Internal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {room.gallery.map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-[2rem] ${i === 0 ? 'col-span-2 h-[40rem]' : 'h-[25rem]'}`}>
                    <LazyImage
                      src={img} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                      alt={`Detail ${i}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-viona-bg/40 border border-viona-bg p-10 rounded-[3rem] shadow-sm space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-viona-detail mb-1">{t.per_night}</p>
                  <p className="text-5xl font-serif text-viona-accent">${room.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-viona-detail mb-1">Status</p>
                  <p className="text-green-600 font-black text-xs uppercase tracking-widest">Available</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={onBook}
                  className="w-full py-6 bg-viona-text text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-viona-accent transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Confirm Reservation <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-[9px] text-viona-detail text-center uppercase font-black tracking-widest opacity-60">No payment required now</p>
              </div>

              <div className="pt-8 border-t border-viona-bg flex flex-col gap-4">
                 <div className="flex items-center gap-4 text-viona-text">
                   <Calendar className="w-5 h-5 text-viona-accent" />
                   <span className="text-xs font-bold">Free cancellation within 24h</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
