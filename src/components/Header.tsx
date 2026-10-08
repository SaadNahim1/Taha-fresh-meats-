import React from 'react';
import { TAHA_LOGO_BASE64, STORE_NAME, STORE_TAGLINE } from '../assets/logo';
import { Phone, ShieldCheck, Clock, MapPin, MessageCircle } from 'lucide-react';

interface HeaderProps {
  whatsAppNumber: string;
  onSecretUnlock?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ whatsAppNumber, onSecretUnlock }) => {
  const tapCountRef = React.useRef(0);
  const tapTimerRef = React.useRef<number | null>(null);

  const handleLogoTap = () => {
    if (!onSecretUnlock) return;
    tapCountRef.current += 1;
    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
    }
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onSecretUnlock();
      return;
    }
    tapTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 900);
  };

  return (
    <header className="bg-gradient-to-b from-[#6b1414] via-[#8b1e1e] to-[#741515] text-white shadow-md border-b border-[#a82a2a]/30">
      {/* Top micro bar with contact & hours */}
      <div className="bg-[#4d0c0c] text-amber-200/90 text-[11px] py-1.5 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Seg - Sáb: 08:00 - 18:30 | Dom: 08:00 - 13:00</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-white/80">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>Maputo e Matola, Moçambique</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:+${whatsAppNumber}`}
              className="hover:text-white transition flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+{whatsAppNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Brand Banner */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Brand Details */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto text-left">
            <div
              onClick={handleLogoTap}
              className="relative flex-none select-none"
            >
              <img
                src={TAHA_LOGO_BASE64}
                alt={STORE_NAME}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-300 shadow-md object-cover bg-white"
              />
              <span
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full text-[10px] shadow"
                title="100% Halal Certificado"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                  {STORE_NAME}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-900/80 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Halal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5">
                Talho & Carnes Nobres Frescas · Cortes Especiais & Encomendas Rápidas
              </p>
              <p className="text-[11px] text-amber-200/80 mt-1">
                {STORE_TAGLINE} · Entregas ao Domicílio
              </p>
            </div>
          </div>

          {/* Customer Call to Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t border-white/10 sm:border-0 pt-3 sm:pt-0">
            <a
              href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
                'Olá! Gostaria de obter informações sobre o catálogo e encomendas da Taha\'s Fresh Meat.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 transition text-xs font-bold text-white shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </a>

            <a
              href={`tel:+${whatsAppNumber}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition text-xs font-semibold text-white border border-white/20"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Ligar</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
