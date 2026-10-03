import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Smartphone, MessageCircle, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  publicUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendViaWhatsApp = () => {
    const text = `Olá! Veja aqui o nosso catálogo online de carnes 100% Halal para fazer encomendas diretas:\n\n${publicUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // QR Code generator URL using public standard API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    publicUrl
  )}&color=8b1e1e&bgcolor=ffffff`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#8b1e1e] text-white">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-300" />
            <div>
              <h2 id="share-modal-title" className="text-base font-bold">
                Mostrar Catálogo ao Cliente
              </h2>
              <p className="text-xs text-amber-100">
                Link direto pronto para abrir no telemóvel dele
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-center">
          {/* QR Code */}
          <div className="bg-stone-50 border-2 border-dashed border-stone-200 p-4 rounded-2xl inline-block mx-auto shadow-inner">
            <img
              src={qrCodeUrl}
              alt="QR Code do Catálogo"
              className="w-44 h-44 rounded-xl mx-auto shadow-xs"
              loading="lazy"
            />
            <p className="text-[11px] text-stone-500 mt-2 font-medium flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-[#8b1e1e]" />
              <span>Aponte a câmara do telemóvel para abrir</span>
            </p>
          </div>

          {/* Link box */}
          <div className="text-left">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Link de Demonstração para o Cliente
            </label>
            <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent px-2 text-xs font-mono text-stone-800 outline-none select-all truncate"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#8b1e1e] hover:bg-[#731717] active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSendViaWhatsApp}
              className="w-full py-2.5 px-4 bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Link pelo WhatsApp</span>
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-4 border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition block"
            >
              <span>Abrir numa nova aba</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-500">
            O seu cliente pode abrir este link sem precisar de instalar nada e já pode fazer pedidos de teste!
          </p>
        </div>
      </div>
    </div>
  );
};
