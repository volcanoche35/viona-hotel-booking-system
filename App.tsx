
import React, { useState, useEffect } from 'react';
import { AMENITIES_MAP } from './constants';
import { Room, Booking, RoomCategory, SiteConfig } from './types';
import { bookingService } from './services/bookingService';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RoomDetailView } from './components/RoomDetailView';
import { LazyImage } from './components/LazyImage';
import { translations, Language } from './translations';
import {
  Calendar,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Globe,
  Instagram,
  Facebook,
  Phone,
  User,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const t = translations[lang];

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ user: '', pass: '' });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(bookingService.getSiteConfig());
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const [viewedRoom, setViewedRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);

  const [availability, setAvailability] = useState<Record<RoomCategory, number>>({
    [RoomCategory.SUITE]: 1,
    [RoomCategory.DOUBLE]: 12,
    [RoomCategory.TWIN]: 4
  });
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(bookingService.getAllBookings());
    setSiteConfig(bookingService.getSiteConfig());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert(lang === 'tr' ? "Çıkış tarihi giriş tarihinden sonra olmalıdır." : "Check-out must be after check-in.");
      return;
    }

    const avail = bookingService.getCategoryAvailability(checkIn, checkOut);
    setAvailability(avail);
    setIsSearched(true);

    const target = document.getElementById('categories');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingConfirm = (newBooking: Booking) => {
    const enrichedBooking = { ...newBooking, roomCategory: bookingRoom?.category };
    bookingService.saveBooking(enrichedBooking as Booking);
    setBookings(prev => [...prev, enrichedBooking as Booking]);

    if (checkIn && checkOut) {
      setAvailability(bookingService.getCategoryAvailability(checkIn, checkOut));
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCreds.user === 'admin' && adminCreds.pass === 'admin') {
      setIsAdmin(true);
      setIsAdminLogin(false);
    } else {
      alert(lang === 'tr' ? "Hatalı kullanıcı adı veya şifre." : "Invalid username or password.");
    }
  };

  const updateGlobalConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    bookingService.updateSiteConfig(newConfig);
  };

  if (isAdmin) {
    return <AdminDashboard bookings={bookings} onLogout={() => setIsAdmin(false)} siteConfig={siteConfig} onUpdateConfig={updateGlobalConfig} lang={lang} />;
  }

  // Oda Detay Görünümü Şartlı Render
  if (viewedRoom) {
    return (
      <RoomDetailView
        room={viewedRoom}
        onBack={() => setViewedRoom(null)}
        onBook={() => {
          setBookingRoom(viewedRoom);
          setViewedRoom(null);
        }}
        lang={lang}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans bg-viona-bg selection:bg-viona-accent selection:text-white" id="home">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50 shadow-sm h-20 md:h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-viona-accent rounded-2xl flex items-center justify-center text-white font-serif text-2xl md:text-3xl shadow-xl shadow-viona-accent/20 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>V</div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl tracking-tight text-viona-text leading-none uppercase">Viona</span>
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] text-viona-detail uppercase">Hotel & Spa</span>
            </div>
          </div>

          <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-viona-text/70">
            <a href="#home" className="hover:text-viona-accent transition-all cursor-pointer">{t.nav_home}</a>
            <a href="#categories" className="hover:text-viona-accent transition-all cursor-pointer">{t.nav_rooms}</a>
            <a href="#philosophy" className="hover:text-viona-accent transition-all cursor-pointer">{t.nav_philosophy}</a>
            <a href="#footer" className="hover:text-viona-accent transition-all cursor-pointer">{t.nav_contact}</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-2 rounded-full border border-gray-200/50">
              <Globe className="w-3 h-3 text-viona-detail" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-viona-text"
              >
                <option value="tr">TR</option>
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            </div>
            <button
              onClick={() => setIsAdminLogin(true)}
              className="p-3 bg-viona-text text-white rounded-xl hover:bg-viona-accent transition-all shadow-lg"
              title="Staff Login"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyImage
            src={siteConfig.hero.image}
            className="w-full h-full object-cover scale-105"
            alt="Viona Hero"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-viona-bg"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl">
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-in slide-in-from-top-4 duration-700">
            <h4 className="uppercase tracking-[0.6em] text-[10px] font-black text-viona-accent">
              {siteConfig.hero.tag[lang] || t.hero_tag}
            </h4>
          </div>
          <h1 className="text-5xl md:text-9xl font-serif mb-10 leading-[0.9] drop-shadow-2xl animate-in fade-in zoom-in duration-1000">
            {(siteConfig.hero.title[lang] || t.hero_title).split(' ')[0]} <br />
            <span className="italic font-light opacity-90">{(siteConfig.hero.title[lang] || t.hero_title).split(' ').slice(1).join(' ')}</span>
          </h1>

          <div className="bg-white/95 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto border border-white animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div
                  className="text-left px-6 py-4 bg-viona-bg/40 rounded-[1.5rem] border border-viona-bg cursor-pointer hover:bg-white transition-all group"
                  onClick={() => {
                    const el = document.getElementById('checkInInput') as HTMLInputElement;
                    if (el && typeof el.showPicker === 'function') el.showPicker();
                  }}
                >
                  <label className="block text-[9px] uppercase font-black text-viona-detail tracking-widest mb-1 group-hover:text-viona-accent transition-colors">{t.search_checkin}</label>
                  <input
                    id="checkInInput"
                    required
                    type="date"
                    className="bg-transparent text-viona-text font-bold w-full outline-none text-sm cursor-pointer"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div
                  className="text-left px-6 py-4 bg-viona-bg/40 rounded-[1.5rem] border border-viona-bg cursor-pointer hover:bg-white transition-all group"
                  onClick={() => {
                    const el = document.getElementById('checkOutInput') as HTMLInputElement;
                    if (el && typeof el.showPicker === 'function') el.showPicker();
                  }}
                >
                  <label className="block text-[9px] uppercase font-black text-viona-detail tracking-widest mb-1 group-hover:text-viona-accent transition-colors">{t.search_checkout}</label>
                  <input
                    id="checkOutInput"
                    required
                    type="date"
                    className="bg-transparent text-viona-text font-bold w-full outline-none text-sm cursor-pointer"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <button type="submit" className="bg-viona-accent text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-viona-accent/30">
                {t.search_btn} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <main id="categories" className="py-24 md:py-40 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <h2 className="text-viona-accent text-xs font-black uppercase tracking-[0.5em] mb-6">{t.category_title}</h2>
          <h3 className="text-4xl md:text-7xl font-serif text-viona-text leading-[1.1]">{t.category_subtitle}</h3>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {siteConfig.rooms.map(room => {
            const roomsLeft = availability[room.category];
            const isAvailable = roomsLeft > 0;
            const cardDisabled = isSearched && !isAvailable;

            return (
              <div key={room.id} className={`group bg-viona-bg/20 rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 border border-transparent hover:border-viona-bg ${cardDisabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <div className="relative h-[30rem] overflow-hidden">
                  <LazyImage
                    src={room.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt={room.name[lang] || 'Room'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-viona-text/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10 text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-viona-accent mb-4 block">Selection 0{room.id.slice(-1)}</span>
                    <h4 className="text-3xl font-serif mb-4 leading-none">{room.name[lang] || 'Category'}</h4>
                    <div className="flex items-center justify-between pt-6 border-t border-white/20">
                      <span className="text-2xl font-serif">${room.price} <span className="text-[10px] font-sans opacity-50 uppercase tracking-widest">{t.per_night}</span></span>
                      <button
                        onClick={() => setViewedRoom(room)}
                        className="p-4 bg-white text-viona-text rounded-full hover:bg-viona-accent hover:text-white transition-all shadow-xl"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 md:py-40 bg-viona-text text-white overflow-hidden relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <LazyImage
                src={siteConfig.about.image1}
                className="rounded-[2rem] shadow-2xl mt-12 w-full aspect-square object-cover"
                alt="Detail 1"
              />
              <LazyImage
                src={siteConfig.about.image2}
                className="rounded-[2rem] shadow-2xl w-full aspect-square object-cover"
                alt="Detail 2"
              />
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-viona-accent text-xs font-black uppercase tracking-[0.5em]">{siteConfig.about.subtitle[lang] || t.philosophy_tag}</h2>
            <h3 className="text-4xl md:text-7xl font-serif leading-tight">{siteConfig.about.title[lang] || t.philosophy_title}</h3>
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed italic border-l-2 border-viona-accent pl-8">
              "{siteConfig.about.philosophy[lang] || t.footer_desc}"
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="bg-white py-24 md:py-32 border-t border-gray-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-viona-accent rounded-2xl flex items-center justify-center text-white font-serif text-3xl shadow-xl">V</div>
                <h4 className="font-serif text-4xl">Viona Hotel</h4>
              </div>
              <p className="text-viona-detail text-lg font-light leading-relaxed max-w-md">
                {t.footer_desc}
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Phone].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 bg-viona-bg rounded-2xl flex items-center justify-center text-viona-text hover:bg-viona-accent hover:text-white transition-all shadow-sm">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-viona-accent">{t.footer_location}</h5>
              <div className="flex gap-4 items-start">
                <MapPin className="w-6 h-6 text-viona-accent flex-shrink-0" />
                <a href="https://maps.google.com/?q=Mithatpaşa+Cd.+No:+120,+Narlıdere+İzmir" target="_blank" rel="noopener noreferrer" className="hover:text-viona-accent transition-colors">
                  <p className="text-viona-text leading-relaxed">Mithatpaşa Cd. No: 120,<br />Narlıdere / İzmir, 35320</p>
                </a>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-viona-accent">{t.admin_access}</h5>
              <button
                onClick={() => setIsAdminLogin(true)}
                className="flex items-center gap-3 px-6 py-4 bg-viona-bg text-viona-text rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-viona-accent hover:text-white transition-all shadow-sm w-full"
              >
                <ShieldAlert className="w-4 h-4" /> staff login
              </button>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-viona-detail">© 2024 Viona Hotel Boutique Experience. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {bookingRoom && (
        <BookingModal
          room={bookingRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          onClose={() => setBookingRoom(null)}
          onConfirm={handleBookingConfirm}
          lang={lang}
        />
      )}

      {isAdminLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-viona-text/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-viona-accent"></div>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-serif">Staff Login</h3>
              <button onClick={() => setIsAdminLogin(false)} className="text-gray-400 hover:text-black transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6">
              <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest">Test Access</p>
              <p className="text-xs text-amber-700 font-medium">User: admin / Pass: admin</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">Username</label>
                <input required type="text" className="w-full px-6 py-4 bg-viona-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-bold" value={adminCreds.user} onChange={e => setAdminCreds({ ...adminCreds, user: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">Password</label>
                <input required type="password" className="w-full px-6 py-4 bg-viona-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-bold" value={adminCreds.pass} onChange={e => setAdminCreds({ ...adminCreds, pass: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-5 bg-viona-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">Enter Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
