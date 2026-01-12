
import React, { useState } from 'react';
import { Room, Booking, RoomCategory } from '../types';
import { X, CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { translations, Language } from '../translations';
import { validateEmail, validatePhone, getValidationError } from '../utils/validation';
import { sendBookingConfirmationEmail } from '../utils/emailTemplate';

interface BookingModalProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  onClose: () => void;
  onConfirm: (booking: Booking) => void;
  lang: Language;
}

export const BookingModal: React.FC<BookingModalProps> = ({ room, checkIn, checkOut, onClose, onConfirm, lang }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [paymentData, setPaymentData] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateTotal = () => {
    const start = new Date(checkIn || new Date());
    const end = new Date(checkOut || new Date().getTime() + 86400000);
    const diff = end.getTime() - start.getTime();
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return days * room.price;
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = lang === 'tr' ? 'İsim en az 2 karakter olmalıdır' : 'Name must be at least 2 characters';
    }

    const emailError = getValidationError('email', formData.email, lang);
    if (emailError) newErrors.email = emailError;

    const phoneError = getValidationError('phone', formData.phone, lang);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep('payment');
      setErrors({});
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation - in production, this would integrate with payment gateway
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiry || !paymentData.cvv) {
      alert(lang === 'tr' ? 'Lütfen tüm ödeme bilgilerini doldurun' : 'Please fill all payment details');
      return;
    }

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: room.id,
      roomName: room.name[lang],
      roomCategory: room.category,
      checkIn,
      checkOut,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      totalPrice: calculateTotal(),
      createdAt: new Date().toISOString()
    };
    
    onConfirm(booking);
    
    // Send confirmation email (mock in development)
    sendBookingConfirmationEmail(booking, lang);
    
    setIsSuccess(true);
    setTimeout(onClose, 3000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-viona-text/80 backdrop-blur-xl p-4">
        <div className="bg-white rounded-[3rem] p-16 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="bg-green-100 p-6 rounded-full inline-block mb-10 text-green-600">
            <CheckCircle2 className="w-20 h-20" />
          </div>
          <h2 className="text-4xl font-serif text-viona-text mb-6">{t.success_msg.split('!')[0]}!</h2>
          <p className="text-viona-detail text-lg italic">{t.success_msg.split('!')[1]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-viona-text/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full my-8">
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif text-viona-text">
              {step === 'info' ? t.confirm_title : (lang === 'tr' ? 'Ödeme Bilgileri' : lang === 'de' ? 'Zahlungsinformationen' : 'Payment Details')}
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-viona-accent mt-1">{room.name[lang]}</p>
            <div className="flex gap-2 mt-3">
              <div className={`h-1 w-12 rounded-full ${step === 'info' ? 'bg-viona-accent' : 'bg-gray-300'}`}></div>
              <div className={`h-1 w-12 rounded-full ${step === 'payment' ? 'bg-viona-accent' : 'bg-gray-300'}`}></div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {step === 'info' ? (
          <form onSubmit={handleInfoSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-6 bg-viona-bg p-6 rounded-3xl">
              <div>
                <label className="text-[10px] font-black uppercase text-viona-detail tracking-widest block mb-1">{t.search_checkin}</label>
                <div className="text-viona-text font-bold">{new Date(checkIn || Date.now()).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-viona-detail tracking-widest block mb-1">{t.search_checkout}</label>
                <div className="text-viona-text font-bold">{new Date(checkOut || Date.now()).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-widest mb-2">{t.form_name}</label>
                <input 
                  required 
                  type="text" 
                  className={`w-full px-6 py-4 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl outline-none focus:border-viona-accent focus:ring-4 focus:ring-viona-accent/10 transition-all font-bold text-viona-text`}
                  value={formData.name} 
                  onChange={e => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-widest mb-2">{t.form_email}</label>
                <input 
                  required 
                  type="email" 
                  placeholder="ornek@email.com"
                  className={`w-full px-6 py-4 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-2xl outline-none focus:border-viona-accent focus:ring-4 focus:ring-viona-accent/10 transition-all font-bold text-viona-text`}
                  value={formData.email} 
                  onChange={e => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                />
                {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-viona-detail tracking-widest mb-2">{t.form_phone}</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="0555 123 45 67"
                  className={`w-full px-6 py-4 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-2xl outline-none focus:border-viona-accent focus:ring-4 focus:ring-viona-accent/10 transition-all font-bold text-viona-text`}
                  value={formData.phone} 
                  onChange={e => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-2 font-bold">{errors.phone}</p>}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-viona-detail tracking-widest">Total</p>
                <p className="text-4xl font-serif text-viona-accent">${calculateTotal()}</p>
              </div>
              <button type="submit" className="bg-viona-accent text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 shadow-xl shadow-viona-accent/20 active:scale-95 transition-all">
                {lang === 'tr' ? 'Ödemeye Geç' : lang === 'de' ? 'Zur Zahlung' : 'Continue to Payment'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="p-10 space-y-8">
            <div className="bg-gradient-to-br from-viona-text to-viona-accent p-8 rounded-3xl text-white shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <CreditCard className="w-12 h-12" />
                <Lock className="w-6 h-6 opacity-60" />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs opacity-70 uppercase tracking-widest mb-2">Card Number</p>
                  <input
                    required
                    type="text"
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 w-full text-lg tracking-wider outline-none focus:bg-white/20 transition-all"
                    value={paymentData.cardNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setPaymentData({ ...paymentData, cardNumber: val });
                    }}
                  />
                </div>
                <div>
                  <p className="text-xs opacity-70 uppercase tracking-widest mb-2">Cardholder Name</p>
                  <input
                    required
                    type="text"
                    placeholder="JOHN DOE"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 w-full uppercase outline-none focus:bg-white/20 transition-all"
                    value={paymentData.cardName}
                    onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-70 uppercase tracking-widest mb-2">Expiry</p>
                    <input
                      required
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 w-full outline-none focus:bg-white/20 transition-all"
                      value={paymentData.expiry}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                        setPaymentData({ ...paymentData, expiry: val });
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs opacity-70 uppercase tracking-widest mb-2">CVV</p>
                    <input
                      required
                      type="text"
                      maxLength={3}
                      placeholder="123"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 w-full outline-none focus:bg-white/20 transition-all"
                      value={paymentData.cvv}
                      onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <p className="text-xs text-amber-800 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {lang === 'tr' 
                  ? '🔒 Bu bir test ödeme simülasyonudur. Gerçek ödeme alınmayacaktır.' 
                  : lang === 'de'
                  ? '🔒 Dies ist eine Testzahlungssimulation. Es wird keine echte Zahlung durchgeführt.'
                  : '🔒 This is a test payment simulation. No real payment will be processed.'}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center gap-4">
              <button 
                type="button" 
                onClick={() => setStep('info')}
                className="px-8 py-5 border-2 border-gray-300 text-viona-text rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-50 transition-all"
              >
                {lang === 'tr' ? 'Geri' : lang === 'de' ? 'Zurück' : 'Back'}
              </button>
              <div className="flex-1 text-right">
                <p className="text-[10px] font-black uppercase text-viona-detail tracking-widest">Total</p>
                <p className="text-3xl font-serif text-viona-accent">${calculateTotal()}</p>
              </div>
              <button type="submit" className="bg-viona-accent text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 shadow-xl shadow-viona-accent/20 active:scale-95 transition-all">
                {t.form_confirm}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
