import React from 'react';
import { TAHA_LOGO_BASE64, STORE_NAME, STORE_TAGLINE } from '../assets/logo';
import { Phone, ShieldCheck, Github, Settings, Share2 } from 'lucide-react';

interface HeaderProps {
  whatsAppNumber: string;
  onOpenGitHubModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  whatsAppNumber,
  onOpenGitHubModal,
  onOpenSettingsModal,
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: STORE_NAME,
          text: "Catálogo online e encomendas de carnes 100% Halal - Taha's Fresh Meat",
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do catálogo copiado para a área de transferência!');
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#741515] via-[#8b1e1e] to-[#601212] text-white shadow-lg border-b border-[#a82a2a]/30">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand info */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="relative">
              <img
                src={TAHA_LOGO_BASE64}
                alt={STORE_NAME}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-amber-300/80 shadow-md object-cover bg-white"
              />
              <span
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full text-[10px] shadow"
                title="100% Halal Certificado"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  {STORE_NAME}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-800/80 text-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-600/40">
                  <ShieldCheck className="w-3 h-3" /> 100% Halal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 font-medium">
                {STORE_TAGLINE}
              </p>
              <div className="flex items-center gap-2 mt-1 sm:hidden">
                <span className="inline-flex items-center gap-1 bg-emerald-900/60 text-emerald-200 text-[11px] px-2 py-0.5 rounded-full font-medium">
                  <ShieldCheck className="w-3 h-3" /> 100% Halal
                </span>
                <span className="text-[11px] text-white/70">
                  WhatsApp: +{whatsAppNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t border-white/10 sm:border-0 pt-2.5 sm:pt-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-medium text-amber-100 border border-white/15"
              title="Partilhar Catálogo"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partilhar</span>
            </button>

            <button
              onClick={onOpenGitHubModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/40 active:scale-95 transition text-xs font-medium text-white border border-white/20"
              title="Conectar com GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="font-semibold">GitHub</span>
            </button>

            <button
              onClick={onOpenSettingsModal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-amber-100 border border-white/15"
              title="Configurações do WhatsApp"
            >
              <Settings className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${whatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25d366] hover:bg-[#20ba59] active:scale-95 transition text-xs font-bold text-white shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
