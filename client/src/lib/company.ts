export const COMPANY = {
  name: 'MANISH ELECTRICALS',
  established: 2001,
  yearsExperience: '20+',
  employees: '90+',
  address: 'P No. 17, Kuber Park Society, Ved Road, Surat - 395004, Gujarat, India',
  addressShort: 'P No. 17, Kuber Park Society, Ved Road, Surat - 395004',
  phone: '+919924109256',
  phoneDisplay: '+91 99241 09256',
  whatsapp: '919924109256',
  email: 'manisheletricals9@gmail.com',
  gst: 'Available',
  pfEsc: 'PF / ESIC: Available',
  languages: ['English', 'Gujarati', 'Hindi'],
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${COMPANY.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const MAPS_EMBED_URL =
  'https://www.google.com/maps?q=P%20No.%2017%2C%20Kuber%20Park%20Society%2C%20Ved%20Road%2C%20Surat%20395004&output=embed';

export const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=P+No.+17,+Kuber+Park+Society,+Ved+Road,+Surat+395004';