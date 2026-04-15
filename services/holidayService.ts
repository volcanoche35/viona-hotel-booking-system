// Holiday Service - Türkiye Tatil Günleri API
// Nager.Date API (ücretsiz): https://date.nager.at/

export interface PublicHoliday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    types: string[];
}

const HOLIDAY_CACHE_KEY = 'viona_holidays_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 saat

interface CachedHolidays {
    year: number;
    holidays: PublicHoliday[];
    fetchedAt: number;
}

// Türkiye tatil günlerini çek
export async function fetchTurkeyHolidays(year: number): Promise<PublicHoliday[]> {
    // Önce cache'e bak
    const cached = getCachedHolidays(year);
    if (cached) return cached;

    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/TR`);
        if (!response.ok) throw new Error('Holiday API failed');

        const holidays: PublicHoliday[] = await response.json();

        // Cache'e kaydet
        saveCacheHolidays(year, holidays);

        return holidays;
    } catch (error) {
        console.warn('Holiday API error, using fallback:', error);
        return getFallbackHolidays(year);
    }
}

// Cache'den oku
function getCachedHolidays(year: number): PublicHoliday[] | null {
    try {
        const raw = localStorage.getItem(HOLIDAY_CACHE_KEY);
        if (!raw) return null;

        const cached: CachedHolidays = JSON.parse(raw);
        const isExpired = Date.now() - cached.fetchedAt > CACHE_DURATION_MS;

        if (cached.year === year && !isExpired) {
            return cached.holidays;
        }
        return null;
    } catch {
        return null;
    }
}

// Cache'e kaydet
function saveCacheHolidays(year: number, holidays: PublicHoliday[]): void {
    const cache: CachedHolidays = {
        year,
        holidays,
        fetchedAt: Date.now()
    };
    localStorage.setItem(HOLIDAY_CACHE_KEY, JSON.stringify(cache));
}

// Fallback: Sabit Türkiye tatilleri (API çalışmazsa)
function getFallbackHolidays(year: number): PublicHoliday[] {
    return [
        { date: `${year}-01-01`, localName: 'Yılbaşı', name: "New Year's Day", countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
        { date: `${year}-04-23`, localName: 'Ulusal Egemenlik ve Çocuk Bayramı', name: 'National Sovereignty and Children\'s Day', countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
        { date: `${year}-05-01`, localName: 'Emek ve Dayanışma Günü', name: 'Labour Day', countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
        { date: `${year}-05-19`, localName: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', name: 'Commemoration of Atatürk, Youth and Sports Day', countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
        { date: `${year}-07-15`, localName: 'Demokrasi ve Milli Birlik Günü', name: 'Democracy and National Unity Day', countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
        { date: `${year}-08-30`, localName: 'Zafer Bayramı', name: 'Victory Day', countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
        { date: `${year}-10-29`, localName: 'Cumhuriyet Bayramı', name: 'Republic Day', countryCode: 'TR', fixed: true, global: true, types: ['Public'] },
    ];
}

// Belirli bir tarihin tatil olup olmadığını kontrol et
export function isHoliday(date: string, holidays: PublicHoliday[]): PublicHoliday | undefined {
    return holidays.find(h => h.date === date);
}

// Belirli bir ayın tatil günlerini getir
export function getHolidaysForMonth(year: number, month: number, holidays: PublicHoliday[]): PublicHoliday[] {
    const monthStr = String(month).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    return holidays.filter(h => h.date.startsWith(prefix));
}
