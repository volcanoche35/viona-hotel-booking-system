// Reservation Request Modal - Concierge Model
// "Sizi Arayalım" formu

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { RoomCategory, ReservationRequest } from '../types';
import { Language } from '../translations';
import { bookingService } from '../services/bookingService';
import { X, Phone, Calendar, User, Check, Send } from 'lucide-react';

interface ReservationRequestModalProps {
    preferredCategory?: RoomCategory;
    onClose: () => void;
    lang: Language;
}

const translations = {
    tr: {
        title: 'Sizi Arayalım',
        subtitle: 'Rezervasyon talebinizi bırakın, en kısa sürede size dönüş yapalım.',
        name: 'Adınız Soyadınız',
        phone: 'Telefon Numaranız',
        email: 'E-posta (Opsiyonel)',
        checkIn: 'Giriş Tarihi',
        checkOut: 'Çıkış Tarihi',
        roomPreference: 'Oda Tercihi',
        seaView: 'Deniz Manzaralı',
        landView: 'Bahçe Manzaralı',
        notes: 'Not (Opsiyonel)',
        submit: 'Talep Gönder',
        successTitle: 'Talebiniz Alındı!',
        successMessage: 'Misafir ilişkileri ekibimiz en kısa sürede sizi arayacaktır.',
        close: 'Kapat'
    },
    en: {
        title: 'Request a Callback',
        subtitle: 'Leave your reservation request and we\'ll get back to you shortly.',
        name: 'Full Name',
        phone: 'Phone Number',
        email: 'Email (Optional)',
        checkIn: 'Check-in Date',
        checkOut: 'Check-out Date',
        roomPreference: 'Room Preference',
        seaView: 'Sea View',
        landView: 'Garden View',
        notes: 'Notes (Optional)',
        submit: 'Submit Request',
        successTitle: 'Request Received!',
        successMessage: 'Our guest relations team will contact you shortly.',
        close: 'Close'
    },
    de: {
        title: 'Rückruf anfordern',
        subtitle: 'Hinterlassen Sie Ihre Reservierungsanfrage und wir melden uns in Kürze bei Ihnen.',
        name: 'Vollständiger Name',
        phone: 'Telefonnummer',
        email: 'E-Mail (Optional)',
        checkIn: 'Check-in Datum',
        checkOut: 'Check-out Datum',
        roomPreference: 'Zimmerpräferenz',
        seaView: 'Meerblick',
        landView: 'Gartenblick',
        notes: 'Notizen (Optional)',
        submit: 'Anfrage senden',
        successTitle: 'Anfrage erhalten!',
        successMessage: 'Unser Gästebetreuungsteam wird sich in Kürze mit Ihnen in Verbindung setzen.',
        close: 'Schließen'
    }
};

export const ReservationRequestModal: React.FC<ReservationRequestModalProps> = ({
    preferredCategory,
    onClose,
    lang
}) => {
    const t = translations[lang];
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        checkIn: '',
        checkOut: '',
        preferredRoomCategory: preferredCategory || RoomCategory.SEA_VIEW,
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Save to localStorage
        const request = bookingService.saveRequest({
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerEmail: formData.customerEmail || undefined,
            preferredRoomCategory: formData.preferredRoomCategory,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            notes: formData.notes || undefined
        });

        // Send email via EmailJS
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (serviceId && serviceId !== 'your_service_id' && templateId && publicKey) {
            try {
                await emailjs.send(serviceId, templateId, {
                    request_id: request.id,
                    customer_name: request.customerName,
                    customer_phone: request.customerPhone,
                    customer_email: request.customerEmail || '-',
                    check_in: request.checkIn,
                    check_out: request.checkOut,
                    room_category: request.preferredRoomCategory,
                    notes: request.notes || '-',
                    created_at: new Date(request.createdAt).toLocaleString('tr-TR'),
                }, publicKey);
            } catch (err) {
                console.warn('EmailJS send failed:', err);
            }
        } else {
            console.log('📋 New Reservation Request (EmailJS not configured):', request);
        }

        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-viona-text/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-serif text-viona-text mb-4">{t.successTitle}</h3>
                    <p className="text-viona-detail mb-8">{t.successMessage}</p>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-viona-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-viona-text/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-2 bg-viona-accent"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-2xl font-serif text-viona-text">{t.title}</h3>
                        <p className="text-viona-detail text-sm mt-2">{t.subtitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                            <User className="w-3 h-3 inline mr-2" />{t.name}
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.customerName}
                            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                            className="w-full px-5 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                            <Phone className="w-3 h-3 inline mr-2" />{t.phone}
                        </label>
                        <input
                            required
                            type="tel"
                            value={formData.customerPhone}
                            onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                            className="w-full px-5 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                            placeholder="+90 5XX XXX XX XX"
                        />
                    </div>

                    {/* Email (Optional) */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                            {t.email}
                        </label>
                        <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                            className="w-full px-5 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                                <Calendar className="w-3 h-3 inline mr-2" />{t.checkIn}
                            </label>
                            <input
                                required
                                type="date"
                                min={today}
                                value={formData.checkIn}
                                onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                                className="w-full px-5 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                                {t.checkOut}
                            </label>
                            <input
                                required
                                type="date"
                                min={formData.checkIn || today}
                                value={formData.checkOut}
                                onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                                className="w-full px-5 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Room Preference */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-3">
                            {t.roomPreference}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, preferredRoomCategory: RoomCategory.SEA_VIEW })}
                                className={`py-4 px-4 rounded-2xl text-sm font-bold transition-all ${formData.preferredRoomCategory === RoomCategory.SEA_VIEW
                                        ? 'bg-viona-accent text-white shadow-lg'
                                        : 'bg-viona-bg/50 text-viona-text hover:bg-viona-bg'
                                    }`}
                            >
                                🌊 {t.seaView}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, preferredRoomCategory: RoomCategory.LAND_VIEW })}
                                className={`py-4 px-4 rounded-2xl text-sm font-bold transition-all ${formData.preferredRoomCategory === RoomCategory.LAND_VIEW
                                        ? 'bg-viona-accent text-white shadow-lg'
                                        : 'bg-viona-bg/50 text-viona-text hover:bg-viona-bg'
                                    }`}
                            >
                                🌳 {t.landView}
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-viona-detail tracking-[0.2em] mb-2">
                            {t.notes}
                        </label>
                        <textarea
                            rows={2}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-5 py-4 bg-viona-bg/50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-viona-accent transition-all font-medium resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-viona-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> {t.submit}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
