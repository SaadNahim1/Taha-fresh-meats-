import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES, formatPriceMT } from '../data/catalog';
import {
  X,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  DollarSign,
  Lock,
  KeyRound,
  ShieldAlert,
  Key,
  Cloud,
  Phone,
  Share2,
  RefreshCw
} from 'lucide-react';

interface StockManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  outOfStockIds: string[];
  customPrices: Record<string, number>;
  onToggleStock: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onResetAll: () => void;
  isUnlocked: boolean;
  onVerifyPin: (pinInput: string) => Promise<boolean>;
  onLockPanel: () => void;
  onUpdatePin: (newPin: string) => Promise<void>;
  isSyncing: boolean;
  syncError: string | null;
  onOpenWhatsAppSettings: () => void;
  onOpenShareModal: () => void;
}

export const StockManagementModal: React.FC<StockManagementModalProps> = ({
  isOpen,
  onClose,
  products,
  outOfStockIds,
  customPrices,
  onToggleStock,
  onUpdatePrice,
  onResetAll,
  isUnlocked,
  onVerifyPin,
  onLockPanel,
  onUpdatePin,
  isSyncing,
  syncError,
  onOpenWhatsAppSettings,
  onOpenShareModal,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Search and editing state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPinInput('');
      setPinError(false);
      setEditingPriceId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim();
    if (clean.length < 4) {
      setPinError(true);
      return;
    }
    setIsVerifyingPin(true);
    setPinError(false);
    try {
      const ok = await onVerifyPin(clean);
      if (ok) {
        setPinInput('');
        setPinError(false);
      } else {
        setPinError(true);
      }
    } catch {
      setPinError(true);
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleSaveNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPinInput.trim();
    if (!/^[0-9]{4,6}$/.test(clean)) {
      setPinChangeError('Use entre 4 e 6 dígitos numéricos.');
      return;
    }
    setPinChangeError(null);
    try {
      await onUpdatePin(clean);
      setPinChangeSuccess(true);
      setTimeout(() => {
        setIsChangingPin(false);
        setPinChangeSuccess(false);
        setNewPinInput('');
      }, 1500);
    } catch (err) {
      setPinChangeError(err instanceof Error ? err.message : 'Erro ao guardar PIN.');
    }
  };

  const handleLogout = () => {
    onLockPanel();
    onClose();
  };

  const outOfStockSet = new Set(outOfStockIds);

  const filteredProducts = products.filter((p) => {
    const matchesCat = !selectedCatId || p.categoryId === selectedCatId;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  const handleStartEditPrice = (p: Product) => {
    setEditingPriceId(p.id);
    const currentPrice = customPrices[p.id] ?? p.price;
    setTempPrice(currentPrice.toString());
  };

  const handleSavePrice = (productId: string) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val > 0) {
      onUpdatePrice(productId, val);
    }
    setEditingPriceId(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4"
    >
      <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Painel Secreto do Proprietário</span>
                <span className="text-[10px] bg-amber-400 text-stone-900 font-extrabold px-1.5 py-0.5 rounded">
                  PIN Protegido
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Sincronização imediata para os telemóveis de todos os clientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If NOT Unlocked: Show PIN Entry */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Digite o PIN do Proprietário
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Introduza o seu PIN numérico de 4 a 6 dígitos para abrir a gestão de stock e preços em tempo real.
              </p>
            </div>

            <form onSubmit={handleSubmitPin} className="w-full max-w-xs space-y-3 pt-2">
              <div>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                    if (pinError) setPinError(false);
                  }}
                  placeholder="••••"
                  className={`w-full text-center tracking-widest text-2xl font-bold py-2.5 px-4 rounded-xl border ${
                    pinError
                      ? 'border-red-500 bg-red-50 text-red-700 focus:ring-red-400'
                      : 'border-stone-300 focus:ring-2 focus:ring-[#8b1e1e] focus:border-transparent'
                  }`}
                  autoFocus
                />
                {pinError && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>PIN incorreto. Tente novamente.</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifyingPin}
                className="w-full py-2.5 bg-[#8b1e1e] hover:bg-[#731717] disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isVerifyingPin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>A verificar PIN...</span>
                  </>
                ) : (
                  <span>Desbloquear Painel</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked: Show Stock & Price Control Panel */
          <>
            {/* Cloud Sync Status Banner */}
            <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-600 flex-none" />
                <span>
                  <strong>Sincronização em Tempo Real Ativa:</strong> Qualquer alteração atualiza automaticamente nos telemóveis dos clientes.
                </span>
              </div>

              {isSyncing && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  A sincronizar...
                </span>
              )}
            </div>

            {syncError && (
              <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 flex-none" />
                <span>{syncError}</span>
              </div>
            )}

            {/* Top Toolbar / Mode switch */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-700 font-bold">
                    Stock Esgotado:{' '}
                    <strong className="text-red-600 font-extrabold">{outOfStockIds.length}</strong>
                  </span>
                  {outOfStockIds.length > 0 && (
                    <button
                      onClick={onResetAll}
                      className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurar todos</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={onOpenWhatsAppSettings}
                    className="text-[11px] text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={onOpenShareModal}
                    className="text-[11px] text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Share2 className="w-3 h-3 text-[#8b1e1e]" />
                    <span>QR Code</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsChangingPin(!isChangingPin);
                      setPinChangeError(null);
                    }}
                    className="text-[11px] text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Key className="w-3 h-3 text-amber-600" />
                    <span>Mudar PIN</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-red-700 hover:text-red-900 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-semibold cursor-pointer"
                  >
                    Trancar
                  </button>
                </div>
              </div>

              {/* Change PIN box */}
              {isChangingPin && (
                <form
                  onSubmit={handleSaveNewPin}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 flex-wrap"
                >
                  <span className="text-xs font-bold text-amber-900">Novo PIN (4-6 dígitos):</span>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ex: 2580"
                    className="px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:ring-1 focus:ring-amber-500 w-32"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800 cursor-pointer"
                  >
                    Gravar PIN na Nuvem
                  </button>
                  {pinChangeSuccess && (
                    <span className="text-xs text-emerald-700 font-bold">
                      ✓ PIN atualizado na nuvem!
                    </span>
                  )}
                  {pinChangeError && (
                    <span className="text-xs text-red-600 font-semibold">
                      {pinChangeError}
                    </span>
                  )}
                </form>
              )}

              {/* Search & Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar corte ou produto..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]"
                  />
                </div>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]"
                >
                  <option value="">Todas as Categorias</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs">
                  Nenhum corte encontrado com este filtro.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = outOfStockSet.has(p.id);
                  const currentPrice = customPrices[p.id] ?? p.price;
                  const isEditingPrice = editingPriceId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`py-3 flex items-center justify-between gap-3 transition ${
                        isOut ? 'bg-red-50/40 -mx-4 px-4' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-stone-900">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
                            {p.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-20 px-2 py-0.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#8b1e1e]"
                                autoFocus
                              />
                              <span className="text-xs text-stone-500">MT</span>
                              <button
                                onClick={() => handleSavePrice(p.id)}
                                className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded text-[10px]"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="font-bold text-[#8b1e1e]">
                                {formatPriceMT(currentPrice)}
                              </span>
                              <span className="text-stone-500">/{p.unit}</span>
                              <button
                                onClick={() => handleStartEditPrice(p)}
                                className="ml-1 p-0.5 text-stone-400 hover:text-stone-700"
                                title="Alterar preço"
                              >
                                <DollarSign className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Status Toggle Button */}
                      <div className="flex-none">
                        <button
                          onClick={() => onToggleStock(p.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                            isOut
                              ? 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                          }`}
                          title={isOut ? 'Clique para marcar em stock' : 'Clique para marcar esgotado'}
                        >
                          {isOut ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Esgotado</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Em Stock</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
              <p className="text-[11px] text-stone-500">
                🔒 Modo Proprietário Ativo · Clique em &ldquo;Trancar&rdquo; para bloquear com PIN.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#8b1e1e] hover:bg-[#731717] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Concluir & Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
