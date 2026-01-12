
import React, { useState } from 'react';
import { Booking, SiteConfig, Room } from '../types';
import { Language } from '../translations';
import { 
  Shield, 
  LogOut, 
  Database, 
  Download, 
  Settings, 
  Bed, 
  Image as ImageIcon, 
  Save, 
  CheckCircle, 
  Clock, 
  Layout,
  Layers,
  Upload,
  Trash2,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  onLogout: () => void;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, onLogout, siteConfig, onUpdateConfig, lang }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'content' | 'roadmap'>('bookings');
  const [editingConfig, setEditingConfig] = useState<SiteConfig>(siteConfig);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);

  const handleSaveConfig = () => {
    onUpdateConfig(editingConfig);
    alert(lang === 'tr' ? 'Ayarlar başarıyla kaydedildi.' : 'Settings saved successfully.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'about1' | 'about2' | 'room' | 'gallery', roomIdx?: number, galleryIdx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In production, upload to cloud storage (Cloudinary, AWS S3, etc.)
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      if (target === 'hero') {
        setEditingConfig({ ...editingConfig, hero: { ...editingConfig.hero, image: imageUrl } });
      } else if (target === 'about1') {
        setEditingConfig({ ...editingConfig, about: { ...editingConfig.about, image1: imageUrl } });
      } else if (target === 'about2') {
        setEditingConfig({ ...editingConfig, about: { ...editingConfig.about, image2: imageUrl } });
      } else if (target === 'room' && roomIdx !== undefined) {
        const newRooms = [...editingConfig.rooms];
        newRooms[roomIdx].image = imageUrl;
        setEditingConfig({ ...editingConfig, rooms: newRooms });
      } else if (target === 'gallery' && roomIdx !== undefined && galleryIdx !== undefined) {
        const newRooms = [...editingConfig.rooms];
        newRooms[roomIdx].gallery[galleryIdx] = imageUrl;
        setEditingConfig({ ...editingConfig, rooms: newRooms });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteGalleryImage = (roomIdx: number, galleryIdx: number) => {
    const newRooms = [...editingConfig.rooms];
    newRooms[roomIdx].gallery.splice(galleryIdx, 1);
    setEditingConfig({ ...editingConfig, rooms: newRooms });
  };

  const handleAddGalleryImage = (roomIdx: number) => {
    const newRooms = [...editingConfig.rooms];
    newRooms[roomIdx].gallery.push('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800');
    setEditingConfig({ ...editingConfig, rooms: newRooms });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Room', 'Guest', 'Check-In', 'Check-Out', 'Total', 'Created At'];
    const rows = bookings.map(b => [
      b.id, b.roomName, b.customerName, b.checkIn, b.checkOut, b.totalPrice, b.createdAt
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `viona_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const roadmapItems = [
    { title: "Core UI / Sanzo Wada Estetiği", status: "completed", date: "Jan 10" },
    { title: "Çoklu Dil (TR/EN/DE) Desteği", status: "completed", date: "Jan 12" },
    { title: "Dinamik Rezervasyon Motoru", status: "completed", date: "Jan 15" },
    { title: "Admin Dashboard ve İçerik Yönetimi", status: "completed", date: "Jan 18" },
    { title: "Navigasyon ve Scroll Fixleri", status: "completed", date: "Jan 20" },
    { title: "Tarih Seçici (Date Picker) Uyumluluğu", status: "completed", date: "Jan 20" },
    { title: "Canlı Veritabanı Entegrasyonu (Firebase)", status: "pending", date: "Next" },
    { title: "E-posta Bildirim Sistemi", status: "pending", date: "Next" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-viona-text text-white px-8 py-6 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="bg-viona-accent p-3 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif">Viona Management</h1>
              <p className="text-viona-detail text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">System Dashboard</p>
            </div>
          </div>
          <div className="flex gap-4">
            {activeTab !== 'bookings' && activeTab !== 'roadmap' && (
              <button onClick={handleSaveConfig} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-xs uppercase tracking-widest">
                <Save className="w-4 h-4" /> Save
              </button>
            )}
            <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-bold text-xs uppercase tracking-widest border border-white/10">
              <LogOut className="w-4 h-4" /> {lang === 'tr' ? 'Çıkış' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-8">
        <div className="max-w-7xl mx-auto flex gap-10">
          {[
            { id: 'bookings', label: lang === 'tr' ? 'Rezervasyonlar' : 'Bookings', icon: Database },
            { id: 'rooms', label: lang === 'tr' ? 'Odalar' : 'Rooms', icon: Bed },
            { id: 'content', label: lang === 'tr' ? 'İçerik' : 'Content', icon: ImageIcon },
            { id: 'roadmap', label: lang === 'tr' ? 'Yol Haritası' : 'Roadmap', icon: Layout }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 py-6 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'border-viona-accent text-viona-accent' : 'border-transparent text-viona-detail hover:text-viona-text'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full p-8 flex-1">
        {activeTab === 'bookings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-viona-detail uppercase tracking-widest mb-4">Total Orders</p>
                <p className="text-5xl font-serif text-viona-text">{bookings.length}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-viona-detail uppercase tracking-widest mb-4">Earnings</p>
                <p className="text-5xl font-serif text-viona-accent">${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center">
                <button onClick={exportToCSV} className="w-full flex items-center justify-center gap-3 py-5 bg-viona-bg rounded-2xl text-viona-text font-black text-xs uppercase tracking-widest hover:bg-viona-accent hover:text-white transition-all shadow-sm">
                  <Download className="w-5 h-5" /> Export Data
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black text-viona-detail uppercase tracking-widest">Guest</th>
                    <th className="px-8 py-6 text-[10px] font-black text-viona-detail uppercase tracking-widest">Check-In/Out</th>
                    <th className="px-8 py-6 text-[10px] font-black text-viona-detail uppercase tracking-widest">Type</th>
                    <th className="px-8 py-6 text-[10px] font-black text-viona-detail uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-viona-text">{b.customerName}</div>
                        <div className="text-[10px] text-viona-detail mt-1">{b.customerEmail}</div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium">{b.checkIn} → {b.checkOut}</td>
                      <td className="px-8 py-6 text-xs text-viona-detail font-bold uppercase">{b.roomName}</td>
                      <td className="px-8 py-6 font-black text-viona-accent">${b.totalPrice}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-viona-detail italic">No bookings found yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
            {editingConfig.rooms.map((room, idx) => (
              <div key={room.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                {/* Main Image with Upload/Preview */}
                <div className="relative group">
                  <img 
                    src={room.image} 
                    className="w-full h-48 object-cover rounded-2xl shadow-inner cursor-pointer" 
                    alt="Room Preview"
                    onClick={() => setImagePreview(room.image)}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-3">
                    <label className="p-3 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-viona-accent" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'room', idx)}
                      />
                    </label>
                    <button 
                      onClick={() => setImagePreview(room.image)}
                      className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                    >
                      <Eye className="w-5 h-5 text-viona-text" />
                    </button>
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black uppercase text-viona-detail tracking-widest">Gallery ({room.gallery.length})</label>
                    <button 
                      onClick={() => handleAddGalleryImage(idx)}
                      className="p-2 bg-viona-accent text-white rounded-lg hover:brightness-110 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {room.gallery.map((img, gIdx) => (
                      <div key={gIdx} className="relative group">
                        <img 
                          src={img} 
                          className="w-full h-16 object-cover rounded-lg cursor-pointer" 
                          onClick={() => {
                            setSelectedGalleryIndex(gIdx);
                            setEditingRoomIndex(idx);
                            setImagePreview(img);
                          }}
                          alt={`Gallery ${gIdx}`}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center gap-1">
                          <label className="p-1.5 bg-white rounded cursor-pointer hover:scale-110 transition-transform">
                            <Upload className="w-3 h-3 text-viona-accent" />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, 'gallery', idx, gIdx)}
                            />
                          </label>
                          <button 
                            onClick={() => handleDeleteGalleryImage(idx, gIdx)}
                            className="p-1.5 bg-red-500 text-white rounded hover:scale-110 transition-transform"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Titles */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-viona-detail block mb-2 tracking-widest">Price ($)</label>
                    <input type="number" className="w-full p-4 bg-gray-50 rounded-xl font-serif text-2xl text-viona-accent" value={room.price} onChange={e => {
                      const newRooms = [...editingConfig.rooms];
                      newRooms[idx].price = Number(e.target.value);
                      setEditingConfig({ ...editingConfig, rooms: newRooms });
                    }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] font-black uppercase text-viona-detail block mb-2 tracking-widest">TR</label>
                      <input type="text" className="w-full p-3 bg-gray-50 rounded-lg text-xs font-bold" value={room.name.tr} onChange={e => {
                        const newRooms = [...editingConfig.rooms];
                        newRooms[idx].name.tr = e.target.value;
                        setEditingConfig({ ...editingConfig, rooms: newRooms });
                      }} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-viona-detail block mb-2 tracking-widest">EN</label>
                      <input type="text" className="w-full p-3 bg-gray-50 rounded-lg text-xs font-bold" value={room.name.en} onChange={e => {
                        const newRooms = [...editingConfig.rooms];
                        newRooms[idx].name.en = e.target.value;
                        setEditingConfig({ ...editingConfig, rooms: newRooms });
                      }} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-viona-detail block mb-2 tracking-widest">DE</label>
                      <input type="text" className="w-full p-3 bg-gray-50 rounded-lg text-xs font-bold" value={room.name.de} onChange={e => {
                        const newRooms = [...editingConfig.rooms];
                        newRooms[idx].name.de = e.target.value;
                        setEditingConfig({ ...editingConfig, rooms: newRooms });
                      }} />
                    </div>
                  </div>

                  {/* Description Fields */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-viona-detail block mb-2 tracking-widest">Description (TR)</label>
                    <textarea 
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs font-medium h-20 resize-none" 
                      value={room.description.tr} 
                      onChange={e => {
                        const newRooms = [...editingConfig.rooms];
                        newRooms[idx].description.tr = e.target.value;
                        setEditingConfig({ ...editingConfig, rooms: newRooms });
                      }} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-viona-detail block mb-2 tracking-widest">Description (EN)</label>
                    <textarea 
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs font-medium h-20 resize-none" 
                      value={room.description.en} 
                      onChange={e => {
                        const newRooms = [...editingConfig.rooms];
                        newRooms[idx].description.en = e.target.value;
                        setEditingConfig({ ...editingConfig, rooms: newRooms });
                      }} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-viona-detail block mb-2 tracking-widest">Description (DE)</label>
                    <textarea 
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs font-medium h-20 resize-none" 
                      value={room.description.de} 
                      onChange={e => {
                        const newRooms = [...editingConfig.rooms];
                        newRooms[idx].description.de = e.target.value;
                        setEditingConfig({ ...editingConfig, rooms: newRooms });
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
            {/* Hero Section */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
              <h4 className="text-2xl font-serif text-viona-text flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-viona-accent" /> Hero Section
              </h4>
              
              {/* Hero Image */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-viona-detail tracking-widest">Hero Image</label>
                <div className="relative group">
                  <img 
                    src={editingConfig.hero.image} 
                    className="w-full h-64 object-cover rounded-2xl shadow-lg cursor-pointer" 
                    alt="Hero Preview"
                    onClick={() => setImagePreview(editingConfig.hero.image)}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-4">
                    <label className="p-4 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-viona-accent" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'hero')}
                      />
                    </label>
                    <button 
                      onClick={() => setImagePreview(editingConfig.hero.image)}
                      className="p-4 bg-white rounded-full hover:scale-110 transition-transform"
                    >
                      <Eye className="w-6 h-6 text-viona-text" />
                    </button>
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Or paste image URL" 
                  className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold" 
                  value={editingConfig.hero.image} 
                  onChange={e => setEditingConfig({ ...editingConfig, hero: { ...editingConfig.hero, image: e.target.value } })} 
                />
              </div>

              {/* Hero Texts */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Tag (TR)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs font-bold" 
                    value={editingConfig.hero.tag.tr} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, tag: { ...editingConfig.hero.tag, tr: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Tag (EN)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs font-bold" 
                    value={editingConfig.hero.tag.en} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, tag: { ...editingConfig.hero.tag, en: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Tag (DE)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs font-bold" 
                    value={editingConfig.hero.tag.de} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, tag: { ...editingConfig.hero.tag, de: e.target.value } } 
                    })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Title (TR)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-serif" 
                    value={editingConfig.hero.title.tr} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, title: { ...editingConfig.hero.title, tr: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Title (EN)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-serif" 
                    value={editingConfig.hero.title.en} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, title: { ...editingConfig.hero.title, en: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Title (DE)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-serif" 
                    value={editingConfig.hero.title.de} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, title: { ...editingConfig.hero.title, de: e.target.value } } 
                    })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Subtitle (TR)</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs resize-none h-20" 
                    value={editingConfig.hero.subtitle.tr} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, subtitle: { ...editingConfig.hero.subtitle, tr: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Subtitle (EN)</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs resize-none h-20" 
                    value={editingConfig.hero.subtitle.en} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, subtitle: { ...editingConfig.hero.subtitle, en: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Subtitle (DE)</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs resize-none h-20" 
                    value={editingConfig.hero.subtitle.de} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      hero: { ...editingConfig.hero, subtitle: { ...editingConfig.hero.subtitle, de: e.target.value } } 
                    })} 
                  />
                </div>
              </div>
            </div>

            {/* Philosophy Section */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
              <h4 className="text-2xl font-serif text-viona-text flex items-center gap-3">
                <Settings className="w-6 h-6 text-viona-accent" /> Philosophy Section
              </h4>
              
              <div className="grid grid-cols-2 gap-8">
                {/* Image 1 */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-viona-detail block">Philosophy Image 1</label>
                  <div className="relative group">
                    <img 
                      src={editingConfig.about.image1} 
                      className="w-full h-48 object-cover rounded-2xl shadow-lg cursor-pointer" 
                      alt="Philosophy 1"
                      onClick={() => setImagePreview(editingConfig.about.image1)}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-3">
                      <label className="p-3 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-viona-accent" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, 'about1')}
                        />
                      </label>
                      <button 
                        onClick={() => setImagePreview(editingConfig.about.image1)}
                        className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Eye className="w-5 h-5 text-viona-text" />
                      </button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Or paste URL" 
                    className="w-full p-4 bg-gray-50 rounded-2xl text-xs" 
                    value={editingConfig.about.image1} 
                    onChange={e => setEditingConfig({ ...editingConfig, about: { ...editingConfig.about, image1: e.target.value } })} 
                  />
                </div>

                {/* Image 2 */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-viona-detail block">Philosophy Image 2</label>
                  <div className="relative group">
                    <img 
                      src={editingConfig.about.image2} 
                      className="w-full h-48 object-cover rounded-2xl shadow-lg cursor-pointer" 
                      alt="Philosophy 2"
                      onClick={() => setImagePreview(editingConfig.about.image2)}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-3">
                      <label className="p-3 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-viona-accent" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, 'about2')}
                        />
                      </label>
                      <button 
                        onClick={() => setImagePreview(editingConfig.about.image2)}
                        className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Eye className="w-5 h-5 text-viona-text" />
                      </button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Or paste URL" 
                    className="w-full p-4 bg-gray-50 rounded-2xl text-xs" 
                    value={editingConfig.about.image2} 
                    onChange={e => setEditingConfig({ ...editingConfig, about: { ...editingConfig.about, image2: e.target.value } })} 
                  />
                </div>
              </div>

              {/* Philosophy Texts */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Title (TR)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-serif" 
                    value={editingConfig.about.title.tr} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      about: { ...editingConfig.about, title: { ...editingConfig.about.title, tr: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Title (EN)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-serif" 
                    value={editingConfig.about.title.en} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      about: { ...editingConfig.about, title: { ...editingConfig.about.title, en: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Title (DE)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-serif" 
                    value={editingConfig.about.title.de} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      about: { ...editingConfig.about, title: { ...editingConfig.about.title, de: e.target.value } } 
                    })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Philosophy (TR)</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs resize-none h-32" 
                    value={editingConfig.about.philosophy.tr} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      about: { ...editingConfig.about, philosophy: { ...editingConfig.about.philosophy, tr: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Philosophy (EN)</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs resize-none h-32" 
                    value={editingConfig.about.philosophy.en} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      about: { ...editingConfig.about, philosophy: { ...editingConfig.about.philosophy, en: e.target.value } } 
                    })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-viona-detail block mb-2">Philosophy (DE)</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs resize-none h-32" 
                    value={editingConfig.about.philosophy.de} 
                    onChange={e => setEditingConfig({ 
                      ...editingConfig, 
                      about: { ...editingConfig.about, philosophy: { ...editingConfig.about.philosophy, de: e.target.value } } 
                    })} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
               <div className="flex items-center gap-4 mb-10">
                 <div className="p-4 bg-viona-accent/10 rounded-2xl">
                   <Layers className="w-8 h-8 text-viona-accent" />
                 </div>
                 <div>
                   <h4 className="text-3xl font-serif text-viona-text">Project Roadmap</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-viona-detail mt-1">Development Status Report</p>
                 </div>
               </div>

               <div className="space-y-6">
                 {roadmapItems.map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-viona-bg/30 rounded-2xl border border-viona-bg/50">
                     <div className="flex items-center gap-4">
                       {item.status === 'completed' ? (
                         <CheckCircle className="w-5 h-5 text-green-600" />
                       ) : (
                         <Clock className="w-5 h-5 text-amber-500" />
                       )}
                       <div>
                         <p className={`font-bold text-sm ${item.status === 'completed' ? 'text-viona-text' : 'text-viona-detail'}`}>{item.title}</p>
                         <p className="text-[9px] uppercase font-black tracking-widest text-viona-detail mt-0.5">{item.date}</p>
                       </div>
                     </div>
                     <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                       {item.status}
                     </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Image Preview Modal with Slider */}
      {imagePreview && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
          <button 
            onClick={() => setImagePreview(null)}
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {editingRoomIndex !== null && editingConfig.rooms[editingRoomIndex] && (
            <>
              <button 
                onClick={() => {
                  const room = editingConfig.rooms[editingRoomIndex!];
                  const newIndex = selectedGalleryIndex > 0 ? selectedGalleryIndex - 1 : room.gallery.length - 1;
                  setSelectedGalleryIndex(newIndex);
                  setImagePreview(room.gallery[newIndex]);
                }}
                className="absolute left-8 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              <button 
                onClick={() => {
                  const room = editingConfig.rooms[editingRoomIndex!];
                  const newIndex = selectedGalleryIndex < room.gallery.length - 1 ? selectedGalleryIndex + 1 : 0;
                  setSelectedGalleryIndex(newIndex);
                  setImagePreview(room.gallery[newIndex]);
                }}
                className="absolute right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          <div className="max-w-6xl w-full space-y-6">
            <img 
              src={imagePreview} 
              className="w-full max-h-[70vh] object-contain rounded-3xl shadow-2xl" 
              alt="Preview"
            />
            
            {editingRoomIndex !== null && editingConfig.rooms[editingRoomIndex] && (
              <div className="flex gap-3 justify-center overflow-x-auto pb-4">
                {editingConfig.rooms[editingRoomIndex].gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    className={`w-24 h-16 object-cover rounded-xl cursor-pointer transition-all ${
                      idx === selectedGalleryIndex ? 'ring-4 ring-viona-accent scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                    onClick={() => {
                      setSelectedGalleryIndex(idx);
                      setImagePreview(img);
                    }}
                    alt={`Thumbnail ${idx}`}
                  />
                ))}
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-white text-center">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                {editingRoomIndex !== null 
                  ? `Gallery ${selectedGalleryIndex + 1} / ${editingConfig.rooms[editingRoomIndex].gallery.length}`
                  : 'Image Preview'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
