
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { AMENITIES_MAP, THIRD_PARTY_LINKS } from './constants';
import { Room, Booking, RoomCategory, SiteConfig } from './types';
import { bookingService } from './services/bookingService';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RoomDetailView } from './components/RoomDetailView';
import { LazyImage } from './components/LazyImage';
import { ReservationRequestModal } from './components/ReservationRequestModal';
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
  X,
  MessageSquare,
  Send,
  Mail,
  Menu
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const t = translations[lang];

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ user: '', pass: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(bookingService.getSiteConfig());
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const [viewedRoom, setViewedRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | undefined>(undefined);

  const [availability, setAvailability] = useState<Record<RoomCategory, number>>({
    [RoomCategory.SEA_VIEW]: 10,
    [RoomCategory.LAND_VIEW]: 10
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    setBookings(bookingService.getAllBookings());
    setSiteConfig(bookingService.getSiteConfig());
  }, []);

  // Hero Slider Auto-Advance (2 slides)
  useEffect(() => {
    const SLIDE_COUNT = 2;
    const interval = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % SLIDE_COUNT);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Hidden admin access via keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Check URL query param for admin access
    const params = new URLSearchParams(window.location.search);
    if (params.get('access') === 'admin') {
      setIsAdminLogin(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
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
    const adminUser = import.meta.env.VITE_ADMIN_USER || 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASS || 'admin';
    if (adminCreds.user === adminUser && adminCreds.pass === adminPass) {
      setIsAdmin(true);
      setIsAdminLogin(false);
      sessionStorage.setItem('viona_admin_session', Date.now().toString());
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
        checkIn={checkIn}
        checkOut={checkOut}
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
            <a href="#contact" className="hover:text-viona-accent transition-all cursor-pointer">{t.nav_contact}</a>
          </div>

          <div className="flex items-center gap-3">
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
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-viona-text" /> : <Menu className="w-5 h-5 text-viona-text" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-6 py-6 gap-1">
            {[
              { href: '#home', label: t.nav_home },
              { href: '#categories', label: t.nav_rooms },
              { href: '#philosophy', label: t.nav_philosophy },
              { href: '#contact', label: t.nav_contact },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[13px] font-black uppercase tracking-[0.3em] text-viona-text/70 hover:text-viona-accent py-4 border-b border-gray-50 last:border-0 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section with Slider */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden rounded-b-[3rem]">
        {/* Slider Background - Direct Implementation */}
        <div className="absolute inset-0 z-0">
          {/* Slide 1 - viona-hero.jpg */}
          <div
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${heroSlideIndex === 0 ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={`${import.meta.env.BASE_URL}viona-hero.jpg`}
              className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${heroSlideIndex === 0 ? 'scale-110' : 'scale-100'
                }`}
              alt="Viona Hotel Hero"
            />
          </div>

          {/* Slide 2 - viona-sunset-reception.jpg */}
          <div
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${heroSlideIndex === 1 ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={`${import.meta.env.BASE_URL}photo/viona-sunset-reception.jpg`}
              className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${heroSlideIndex === 1 ? 'scale-110' : 'scale-100'
                }`}
              alt="Viona Sunset Reception"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-viona-bg pointer-events-none"></div>
          {/* Soft edge vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none rounded-b-[3rem]"></div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlideIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${idx === heroSlideIndex
                ? 'bg-viona-accent w-8'
                : 'bg-white/40 hover:bg-white/60 w-2'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Content - Only Title */}
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
        </div>
      </section>

      {/* Search Form Section - Below Hero */}
      <section className="relative z-30 -mt-16 px-6">
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto border border-gray-100">
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
      </section>

      {/* Categories Section */}
      <main id="categories" className="py-24 md:py-40 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <h2 className="text-viona-accent text-xs font-black uppercase tracking-[0.5em] mb-6">{t.category_title}</h2>
          <h3 className="text-4xl md:text-7xl font-serif text-viona-text leading-[1.1]">{t.category_subtitle}</h3>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {siteConfig.rooms.map(room => {
            const roomsLeft = availability[room.category];
            const isAvailable = roomsLeft > 0;
            const cardDisabled = isSearched && !isAvailable;
            const categoryLabel = room.category === RoomCategory.SEA_VIEW ? '🌊' : '🌳';

            return (
              <div key={room.id} className={`group bg-viona-bg/20 rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 border border-transparent hover:border-viona-bg ${cardDisabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <div className="relative h-[28rem] overflow-hidden">
                  <LazyImage
                    src={room.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt={room.name[lang] || 'Room'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-viona-text/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-viona-accent mb-3 block">{categoryLabel} {room.category}</span>
                    <h4 className="text-3xl font-serif mb-4 leading-tight">{room.name[lang] || 'Room'}</h4>
                    <p className="text-white/70 text-sm mb-6 line-clamp-2">{room.description[lang]}</p>
                    <div className="flex items-center justify-between pt-5 border-t border-white/20">
                      {/* Price Hidden for Request System */}
                      {/* <span className="text-2xl font-serif">${room.price} <span className="text-[10px] font-sans opacity-50 uppercase tracking-widest">{t.per_night}</span></span> */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewedRoom(room)}
                          className="px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white hover:text-viona-text transition-all text-xs font-bold uppercase tracking-wider"
                        >
                          {lang === 'tr' ? 'Detay' : 'Details'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(room.category);
                            setRequestModalOpen(true);
                          }}
                          className="px-5 py-3 bg-viona-accent text-white rounded-xl hover:brightness-110 transition-all text-xs font-bold uppercase tracking-wider shadow-lg"
                        >
                          {lang === 'tr' ? 'Sizi Arayalım' : 'Request Call'}
                        </button>
                      </div>
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

      {/* Contact Form Section */}
      <section id="contact" className="py-24 md:py-32 bg-viona-bg/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-viona-accent text-xs font-black uppercase tracking-[0.5em]">{lang === 'tr' ? 'İletişim' : 'Contact'}</h2>
              <h3 className="text-4xl md:text-6xl font-serif text-viona-text leading-tight">
                {lang === 'tr' ? 'Bize Ulaşın' : 'Get in Touch'}
              </h3>
              <p className="text-viona-detail text-lg font-light leading-relaxed max-w-md">
                {lang === 'tr'
                  ? 'Sorularınız veya rezervasyon talepleriniz için bizimle iletişime geçebilirsiniz.'
                  : 'Feel free to reach out for inquiries or reservation requests.'}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-viona-accent/10 rounded-2xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-viona-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-viona-detail">{lang === 'tr' ? 'Telefon' : 'Phone'}</p>
                    <a href="tel:+905323612660" className="text-viona-text font-bold hover:text-viona-accent transition-colors">+90 532 361 26 60</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-viona-accent/10 rounded-2xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-viona-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-viona-detail">Email</p>
                    <a href="mailto:info@vionahotel.com" className="text-viona-text font-bold hover:text-viona-accent transition-colors">info@vionahotel.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-viona-accent/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-viona-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-viona-detail">{lang === 'tr' ? 'Adres' : 'Address'}</p>
                    <a href="https://maps.google.com/?q=Mithatpaşa+Cd.+No:+120,+Narlıdere+İzmir" target="_blank" rel="noopener noreferrer" className="text-viona-text font-bold hover:text-viona-accent transition-colors text-sm">Mithatpaşa Cd. No: 120, Narlıdere / İzmir</a>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 mt-4">
                <iframe
                  title="Viona Hotel Konumu"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.5!2d26.8!3d38.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDI1JzEyLjAiTiAyNsKwNDgnMDAuMCJF!5e0!3m2!1str!2str!4v1"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setContactStatus('sending');

                const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
                const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
                const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

                if (serviceId && serviceId !== 'your_service_id' && templateId && publicKey) {
                  try {
                    await emailjs.send(serviceId, templateId, {
                      from_name: contactForm.name,
                      from_email: contactForm.email,
                      subject: contactForm.subject,
                      message: contactForm.message,
                    }, publicKey);
                    setContactStatus('sent');
                    setContactForm({ name: '', email: '', subject: '', message: '' });
                    setTimeout(() => setContactStatus('idle'), 3000);
                  } catch {
                    setContactStatus('error');
                    setTimeout(() => setContactStatus('idle'), 3000);
                  }
                } else {
                  // Fallback: mailto link
                  const mailtoLink = `mailto:info@vionahotel.com?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(`Ad: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`)}`;
                  window.open(mailtoLink, '_blank');
                  setContactStatus('sent');
                  setContactForm({ name: '', email: '', subject: '', message: '' });
                  setTimeout(() => setContactStatus('idle'), 3000);
                }
              }}
              className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                    {lang === 'tr' ? 'Adınız' : 'Your Name'}
                  </label>
                  <input
                    required
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-6 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                    placeholder={lang === 'tr' ? 'Adınızı girin' : 'Enter your name'}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-6 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                  {lang === 'tr' ? 'Konu' : 'Subject'}
                </label>
                <input
                  required
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-6 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                  placeholder={lang === 'tr' ? 'Mesaj konusu' : 'Message subject'}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                  {lang === 'tr' ? 'Mesajınız' : 'Your Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-6 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium resize-none"
                  placeholder={lang === 'tr' ? 'Mesajınızı yazın...' : 'Write your message...'}
                />
              </div>
              <button
                type="submit"
                disabled={contactStatus === 'sending'}
                className="w-full py-5 bg-viona-text text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-viona-accent transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {contactStatus === 'sending' ? (
                  <span>{lang === 'tr' ? 'Gönderiliyor...' : 'Sending...'}</span>
                ) : contactStatus === 'sent' ? (
                  <span>✓ {lang === 'tr' ? 'Gönderildi!' : 'Sent!'}</span>
                ) : contactStatus === 'error' ? (
                  <span>✗ {lang === 'tr' ? 'Hata! Tekrar deneyin.' : 'Error! Please try again.'}</span>
                ) : (
                  <><Send className="w-4 h-4" /> {lang === 'tr' ? 'Mesaj Gönder' : 'Send Message'}</>
                )}
              </button>
            </form>
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
                <a href="https://instagram.com/vionahotel" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-viona-bg rounded-2xl flex items-center justify-center text-viona-text hover:bg-viona-accent hover:text-white transition-all shadow-sm" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://facebook.com/vionahotel" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-viona-bg rounded-2xl flex items-center justify-center text-viona-text hover:bg-viona-accent hover:text-white transition-all shadow-sm" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="tel:+905323612660" className="w-12 h-12 bg-viona-bg rounded-2xl flex items-center justify-center text-viona-text hover:bg-viona-accent hover:text-white transition-all shadow-sm" aria-label="Telefon">
                  <Phone className="w-5 h-5" />
                </a>
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
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-viona-accent">
                {t.admin_access}
              </h5>
              <button
                onClick={() => setIsAdminLogin(true)}
                className="group flex items-center gap-2 text-viona-text hover:text-viona-accent transition-colors"
              >
                <span className="font-serif italic text-lg">{lang === 'tr' ? 'Personel Girişi' : 'Staff Login'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-viona-detail">© 2026 Viona Hotel Boutique Experience. All rights reserved.</p>
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

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '905323612660'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-bounce"
        style={{ animationDuration: '2s', animationIterationCount: 3 }}
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
      </a>

      {/* Reservation Request Modal */}
      {requestModalOpen && (
        <ReservationRequestModal
          preferredCategory={selectedCategory}
          onClose={() => {
            setRequestModalOpen(false);
            setSelectedCategory(undefined);
          }}
          lang={lang}
        />
      )}
    </div>
  );
};

export default App;
