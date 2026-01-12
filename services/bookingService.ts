
import { Booking, RoomCategory, SiteConfig } from '../types';
import { CATEGORY_COUNTS, INITIAL_SITE_CONFIG } from '../constants';

const STORAGE_KEY = 'viona_hotel_bookings';
const CONFIG_KEY = 'viona_hotel_config';

export const bookingService = {
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

  getSiteConfig: (): SiteConfig => {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : INITIAL_SITE_CONFIG;
  },

  updateSiteConfig: (config: SiteConfig): void => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }
};
