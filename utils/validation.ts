// Form validation utilities with Regex patterns

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PHONE_REGEX = {
  TR: /^(\+90|0)?5\d{9}$/,  // Turkish format: 5XXXXXXXXX or +905XXXXXXXXX
  INTERNATIONAL: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
};

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const validatePhone = (phone: string, strict: boolean = false): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (strict) {
    return PHONE_REGEX.TR.test(cleanPhone);
  }
  
  return PHONE_REGEX.INTERNATIONAL.test(cleanPhone);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Turkish format
  if (cleaned.startsWith('90') && cleaned.length === 12) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  if (cleaned.startsWith('5') && cleaned.length === 10) {
    return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

export const getValidationError = (field: string, value: string, lang: 'tr' | 'en' | 'de'): string | null => {
  const errors = {
    tr: {
      email: 'Geçerli bir e-posta adresi giriniz (örn: isim@domain.com)',
      phone: 'Geçerli bir telefon numarası giriniz (örn: 0555 123 45 67)'
    },
    en: {
      email: 'Please enter a valid email address (e.g., name@domain.com)',
      phone: 'Please enter a valid phone number (e.g., 0555 123 45 67)'
    },
    de: {
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@domain.com)',
      phone: 'Bitte geben Sie eine gültige Telefonnummer ein (z.B. 0555 123 45 67)'
    }
  };

  if (field === 'email' && !validateEmail(value)) {
    return errors[lang].email;
  }
  
  if (field === 'phone' && !validatePhone(value)) {
    return errors[lang].phone;
  }

  return null;
};
