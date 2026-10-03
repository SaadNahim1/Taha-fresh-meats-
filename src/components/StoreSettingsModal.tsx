import React, { useState } from 'react';
import { X, Phone, Save, RotateCcw, Check, MessageSquare } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '../assets/logo';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWhatsApp: string;
  onSaveWhatsApp: (newNumber: string) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  currentWhatsApp,
  onSaveWhatsApp,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(currentWhatsApp);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    onSaveWhatsApp(cleanNumber);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setPhoneNumber(DEFAULT_WHATSAPP_NUMBER);
    onSaveWhatsApp(DEFAULT_WHATSAPP_NUMBER);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 bg-[#8b1e1e] text-white">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <h2 id="settings-modal-title" className="text-base font-bold">
              Configurações do WhatsApp
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Configure o número de WhatsApp que irá receber todas as mensagens dos pedidos realizados pelos clientes.
          </p>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Número de WhatsApp (com código do país)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">
                +
              </span>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="258847521920"
                className="w-full pl-7 pr-3 py-2 text-sm font-mono bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Padrão: <code>258847521920</code> (Moçambique +258)
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar número original</span>
            </button>

            <a
              href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Testar conversa</span>
            </a>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 border border-stone-300 rounded-xl text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-[#8b1e1e] hover:bg-[#731717] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
