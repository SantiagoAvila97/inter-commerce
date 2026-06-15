export const SITE_CONFIG = {
  author: {
    name: 'Santiago Avila Pacanchique',
    linkedInUrl: 'https://www.linkedin.com/in/santiago-avila-10a533231/',
    email: 'santiagoavilapacanchique@gmail.com',
    phone: '3108152869',
    phoneCountryCode: '57',
  },
  contact: {
    headerMenuLabel: 'Realizador',
    footerNote: '¿Te gustó la prueba técnica? Me encantaría saber tu opinión.',
    whatsAppMessage:
      'Hola Santiago, me gustó tu prueba técnica InterCommerce. ¡Quedó muy bien!',
    emailSubject: 'InterCommerce — Prueba técnica',
  },
} as const;

export function formatContactPhone(countryCode: string, phone: string): string {
  if (phone.length === 10) {
    return `+${countryCode} ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }

  return `+${countryCode} ${phone}`;
}

export function getWhatsAppUrl(countryCode: string, phone: string, message: string): string {
  return `https://wa.me/${countryCode}${phone}?text=${encodeURIComponent(message)}`;
}

export function getMailtoUrl(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
