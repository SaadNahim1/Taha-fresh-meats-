export const TAHA_LOGO_BASE64 = new URL(
  './images/taha_fresh_meat_logo_1791452896946.jpg',
  import.meta.url
).href;

export const TAHA_LOGO_SVG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#9e2222"/>
      <stop offset="100%" stop-color="#5c0f0f"/>
    </radialGradient>
  </defs>
  <circle cx="80" cy="80" r="78" fill="url(#bg)" stroke="#f59e0b" stroke-width="4"/>
  <circle cx="80" cy="80" r="68" fill="none" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M52 54 C52 42, 108 42, 108 54 L102 74 C102 82, 58 82, 58 74 Z" fill="#fef3c7" opacity="0.15"/>
  <text x="80" y="66" text-anchor="middle" fill="#fde68a" font-family="Georgia, serif" font-weight="bold" font-size="24" letter-spacing="1">TAHA'S</text>
  <text x="80" y="88" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="15" letter-spacing="1.5">FRESH MEAT</text>
  <rect x="34" y="102" width="92" height="20" rx="10" fill="#065f46" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="80" y="116" text-anchor="middle" fill="#ecfdf5" font-family="Arial, sans-serif" font-weight="bold" font-size="11" letter-spacing="1">100% HALAL</text>
</svg>`);

export const DEFAULT_WHATSAPP_NUMBER = "258847521920";
export const STORE_NAME = "Taha's Fresh Meat";
export const STORE_TAGLINE = "Carne 100% Halal · Moçambique";
