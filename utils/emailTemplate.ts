import { Booking } from '../types';
import { Language } from '../translations';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const generateBookingConfirmationEmail = (
  booking: Booking,
  lang: Language = 'tr'
): EmailTemplate => {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  const content = {
    tr: {
      subject: `Rezervasyon Onayı - Viona Hotel & Spa - ${booking.id}`,
      greeting: `Sayın ${booking.customerName},`,
      confirmation: 'Rezervasyonunuz başarıyla alındı!',
      thankYou: 'Viona Hotel & Spa\'yı tercih ettiğiniz için teşekkür ederiz.',
      details: 'Rezervasyon Detayları',
      bookingId: 'Rezervasyon No',
      room: 'Oda Tipi',
      checkIn: 'Giriş',
      checkOut: 'Çıkış',
      nights: 'Gece Sayısı',
      totalPrice: 'Toplam Ücret',
      contact: 'İletişim Bilgileriniz',
      email: 'E-posta',
      phone: 'Telefon',
      importantInfo: 'Önemli Bilgiler',
      cancellation: '• Ücretsiz iptal hakkınız rezervasyondan 24 saat öncesine kadardır.',
      checkInTime: '• Giriş saati: 14:00 / Çıkış saati: 11:00',
      idRequired: '• Check-in için kimlik belgesi gereklidir.',
      footer: 'Herhangi bir sorunuz olması durumunda lütfen bizimle iletişime geçin.',
      regards: 'Saygılarımızla,',
      team: 'Viona Hotel & Spa Ekibi'
    },
    en: {
      subject: `Booking Confirmation - Viona Hotel & Spa - ${booking.id}`,
      greeting: `Dear ${booking.customerName},`,
      confirmation: 'Your reservation has been confirmed!',
      thankYou: 'Thank you for choosing Viona Hotel & Spa.',
      details: 'Reservation Details',
      bookingId: 'Booking ID',
      room: 'Room Type',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      nights: 'Number of Nights',
      totalPrice: 'Total Price',
      contact: 'Your Contact Information',
      email: 'Email',
      phone: 'Phone',
      importantInfo: 'Important Information',
      cancellation: '• Free cancellation is available up to 24 hours before your reservation.',
      checkInTime: '• Check-in time: 2:00 PM / Check-out time: 11:00 AM',
      idRequired: '• ID is required for check-in.',
      footer: 'If you have any questions, please feel free to contact us.',
      regards: 'Best regards,',
      team: 'Viona Hotel & Spa Team'
    },
    de: {
      subject: `Buchungsbestätigung - Viona Hotel & Spa - ${booking.id}`,
      greeting: `Sehr geehrte/r ${booking.customerName},`,
      confirmation: 'Ihre Reservierung wurde bestätigt!',
      thankYou: 'Vielen Dank, dass Sie sich für Viona Hotel & Spa entschieden haben.',
      details: 'Reservierungsdetails',
      bookingId: 'Buchungs-ID',
      room: 'Zimmertyp',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      nights: 'Anzahl der Nächte',
      totalPrice: 'Gesamtpreis',
      contact: 'Ihre Kontaktinformationen',
      email: 'E-Mail',
      phone: 'Telefon',
      importantInfo: 'Wichtige Informationen',
      cancellation: '• Kostenlose Stornierung ist bis zu 24 Stunden vor Ihrer Reservierung möglich.',
      checkInTime: '• Check-in Zeit: 14:00 Uhr / Check-out Zeit: 11:00 Uhr',
      idRequired: '• Für den Check-in ist ein Ausweis erforderlich.',
      footer: 'Bei Fragen kontaktieren Sie uns bitte.',
      regards: 'Mit freundlichen Grüßen,',
      team: 'Viona Hotel & Spa Team'
    }
  };

  const t = content[lang];

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      background-color: #F4EDE4;
      padding: 40px 20px;
      color: #3E3C3A;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(62, 60, 58, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #3E3C3A 0%, #5a5856 100%);
      padding: 40px;
      text-align: center;
      color: white;
    }
    .logo {
      width: 64px;
      height: 64px;
      background: #D9835D;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-family: Georgia, serif;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(217, 131, 93, 0.3);
    }
    .header h1 {
      font-size: 28px;
      font-family: Georgia, serif;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    .header p {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 4px;
      opacity: 0.8;
      font-weight: 700;
    }
    .content {
      padding: 48px 40px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #3E3C3A;
    }
    .confirmation {
      font-size: 24px;
      font-family: Georgia, serif;
      color: #D9835D;
      margin-bottom: 12px;
    }
    .thank-you {
      font-size: 14px;
      color: #666;
      margin-bottom: 32px;
      font-style: italic;
    }
    .section-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 800;
      color: #D9835D;
      margin: 32px 0 16px;
    }
    .details-box {
      background: #F4EDE4;
      padding: 24px;
      border-radius: 16px;
      margin-bottom: 24px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(62, 60, 58, 0.1);
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      color: #666;
    }
    .detail-value {
      font-size: 14px;
      font-weight: 600;
      color: #3E3C3A;
      text-align: right;
    }
    .total-price {
      background: #3E3C3A;
      color: white;
      padding: 20px 24px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0;
    }
    .total-price .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 800;
    }
    .total-price .value {
      font-size: 32px;
      font-family: Georgia, serif;
      color: #D9835D;
    }
    .info-list {
      background: #FFF9F0;
      border: 2px solid #FFE4B5;
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
    }
    .info-list li {
      font-size: 13px;
      line-height: 1.8;
      color: #3E3C3A;
      margin-bottom: 8px;
    }
    .footer {
      padding: 32px 40px;
      background: #FAFAFA;
      text-align: center;
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }
    .footer-message {
      margin-bottom: 16px;
      font-style: italic;
    }
    .signature {
      font-weight: 600;
      color: #3E3C3A;
    }
    .contact-info {
      margin-top: 24px;
      font-size: 11px;
      color: #999;
    }
    @media (max-width: 600px) {
      .content { padding: 32px 24px; }
      .header { padding: 32px 24px; }
      .footer { padding: 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">V</div>
      <h1>VIONA</h1>
      <p>Hotel & Spa</p>
    </div>

    <div class="content">
      <p class="greeting">${t.greeting}</p>
      <h2 class="confirmation">${t.confirmation}</h2>
      <p class="thank-you">${t.thankYou}</p>

      <h3 class="section-title">${t.details}</h3>
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">${t.bookingId}</span>
          <span class="detail-value">${booking.id.toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.room}</span>
          <span class="detail-value">${booking.roomName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.checkIn}</span>
          <span class="detail-value">${checkInDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.checkOut}</span>
          <span class="detail-value">${checkOutDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.nights}</span>
          <span class="detail-value">${nights}</span>
        </div>
      </div>

      <div class="total-price">
        <span class="label">${t.totalPrice}</span>
        <span class="value">$${booking.totalPrice}</span>
      </div>

      <h3 class="section-title">${t.contact}</h3>
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">${t.email}</span>
          <span class="detail-value">${booking.customerEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.phone}</span>
          <span class="detail-value">${booking.customerPhone}</span>
        </div>
      </div>

      <h3 class="section-title">${t.importantInfo}</h3>
      <div class="info-list">
        <ul>
          <li>${t.cancellation}</li>
          <li>${t.checkInTime}</li>
          <li>${t.idRequired}</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p class="footer-message">${t.footer}</p>
      <p class="signature">${t.regards}<br><strong>${t.team}</strong></p>
      <div class="contact-info">
        📍 Narlıdere, İzmir, Turkey<br>
        📞 +90 232 XXX XX XX<br>
        ✉️ info@vionahotel.com
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
${t.greeting}

${t.confirmation}
${t.thankYou}

${t.details}
${t.bookingId}: ${booking.id}
${t.room}: ${booking.roomName}
${t.checkIn}: ${checkInDate}
${t.checkOut}: ${checkOutDate}
${t.nights}: ${nights}
${t.totalPrice}: $${booking.totalPrice}

${t.contact}
${t.email}: ${booking.customerEmail}
${t.phone}: ${booking.customerPhone}

${t.importantInfo}
${t.cancellation}
${t.checkInTime}
${t.idRequired}

${t.footer}

${t.regards}
${t.team}

Viona Hotel & Spa
Narlıdere, İzmir, Turkey
+90 232 XXX XX XX
info@vionahotel.com
  `.trim();

  return {
    subject: t.subject,
    html,
    text
  };
};

// Mock email sender - in production, integrate with SendGrid, AWS SES, etc.
export const sendBookingConfirmationEmail = async (
  booking: Booking,
  lang: Language = 'tr'
): Promise<boolean> => {
  const emailTemplate = generateBookingConfirmationEmail(booking, lang);
  
  console.log('📧 Email Preview (Development Mode):');
  console.log('To:', booking.customerEmail);
  console.log('Subject:', emailTemplate.subject);
  console.log('\nHTML Preview:', emailTemplate.html.substring(0, 500) + '...');
  
  // In production, replace with actual email service:
  // await emailService.send({
  //   to: booking.customerEmail,
  //   subject: emailTemplate.subject,
  //   html: emailTemplate.html,
  //   text: emailTemplate.text
  // });
  
  return true;
};
