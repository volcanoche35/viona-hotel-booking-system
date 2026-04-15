
import { Booking, RoomCategory, SiteConfig, ReservationRequest, BlockedDate } from '../types';
import { CATEGORY_COUNTS, INITIAL_SITE_CONFIG } from '../constants';

const STORAGE_KEY = 'viona_hotel_bookings';
const CONFIG_KEY = 'viona_hotel_config';
const REQUESTS_KEY = 'viona_reservation_requests';
const BLOCKED_DATES_KEY = 'viona_blocked_dates';

export const bookingService = {
  // === Booking Functions (Legacy) ===
  getAllBookings: (): Booking[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBooking: (booking: Booking): void => {
    const bookings = bookingService.getAllBookings();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  },

  getCategoryAvailability: (checkIn: string, checkOut: string): Record<RoomCategory, number> => {
    const allBookings = bookingService.getAllBookings();
    const reqIn = new Date(checkIn);
    const reqOut = new Date(checkOut);

    const counts = { ...CATEGORY_COUNTS };

    allBookings.forEach(b => {
      const bIn = new Date(b.checkIn);
      const bOut = new Date(b.checkOut);
      if ((reqIn < bOut) && (reqOut > bIn)) {
        const cat = b.roomCategory as RoomCategory;
        if (cat && counts[cat] > 0) {
          counts[cat]--;
        }
      }
    });
    return counts;
  },

  // === Reservation Request Functions (New) ===
  getAllRequests: (): ReservationRequest[] => {
    const data = localStorage.getItem(REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRequest: (request: Omit<ReservationRequest, 'id' | 'status' | 'createdAt'>): ReservationRequest => {
    const requests = bookingService.getAllRequests();
    const newRequest: ReservationRequest = {
      ...request,
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    return newRequest;
  },

  updateRequestStatus: (id: string, status: ReservationRequest['status']): void => {
    const requests = bookingService.getAllRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx !== -1) {
      requests[idx].status = status;
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    }
  },

  // === Blocked Dates Functions ===
  getBlockedDates: (): BlockedDate[] => {
    const data = localStorage.getItem(BLOCKED_DATES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBlockedDate: (blockedDate: Omit<BlockedDate, 'id'>): BlockedDate => {
    const dates = bookingService.getBlockedDates();
    const newBlocked: BlockedDate = {
      ...blockedDate,
      id: `BLK-${Date.now().toString(36).toUpperCase()}`
    };
    dates.push(newBlocked);
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(dates));
    return newBlocked;
  },

  removeBlockedDate: (id: string): void => {
    const dates = bookingService.getBlockedDates().filter(d => d.id !== id);
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(dates));
  },

  isDateBlocked: (date: string, category?: RoomCategory): boolean => {
    const blocked = bookingService.getBlockedDates();
    return blocked.some(b => b.date === date && (!category || b.roomCategory === category));
  },

  // === Site Config Functions ===
  getSiteConfig: (): SiteConfig => {
    const data = localStorage.getItem(CONFIG_KEY);
    if (!data) return INITIAL_SITE_CONFIG;

    const stored = JSON.parse(data);
    return {
      ...INITIAL_SITE_CONFIG,
      ...stored,
      hero: {
        ...INITIAL_SITE_CONFIG.hero,
        ...stored.hero,
        slides: stored.hero?.slides || INITIAL_SITE_CONFIG.hero.slides
      },
      about: {
        ...INITIAL_SITE_CONFIG.about,
        ...stored.about
      },
      rooms: stored.rooms || INITIAL_SITE_CONFIG.rooms
    };
  },

  updateSiteConfig: (config: SiteConfig): void => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }
};

