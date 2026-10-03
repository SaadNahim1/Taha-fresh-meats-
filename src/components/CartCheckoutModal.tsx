import React, { useState } from 'react';
import { CartItem, CustomerOrderInfo } from '../types';
import { formatPriceMT } from '../data/catalog';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  Copy,
  Check,
  MapPin,
  User,
  Phone,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  whatsAppNumber: string;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  whatsAppNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>({
    name: '',
    phone: '',
    orderType: 'delivery',
    address: '',
    paymentMethod: 'M-Pesa',
    notes: '',
  });

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const generateWhatsAppMessage = () => {
    let msg = `🥩 *PEDIDO - TAHA'S FRESH MEAT* 🥩\n`;
    msg += `Carne 100% Halal\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (customerInfo.name.trim()) {
      msg += `👤 *Cliente:* ${customerInfo.name.trim()}\n`;
    }
    if (customerInfo.phone.trim()) {
      msg += `📱 *Contacto:* ${customerInfo.phone.trim()}\n`;
    }

    msg += `🚚 *Tipo:* ${
      customerInfo.orderType === 'delivery'
        ? `Entrega ao domicílio`
        : `Levantamento na loja`
    }\n`;

    if (customerInfo.orderType === 'delivery' && customerInfo.address.trim()) {
      msg += `📍 *Morada:* ${customerInfo.address.trim()}\n`;
    }

    msg += `💳 *Pagamento:* ${customerInfo.paymentMethod}\n\n`;

    msg += `🛒 *ITENS DO PEDIDO:*\n`;
    cartItems.forEach((item) => {
      const lineTotal = item.quantity * item.product.price;
      const unitLabel = item.product.isPerKg ? 'kg' : item.product.unit;
      msg += `• ${item.quantity} ${unitLabel} × ${item.product.name} — ${formatPriceMT(lineTotal)}\n`;
    });

    msg += `\n💰 *TOTAL ESTIMADO: ${formatPriceMT(totalPrice)}*\n`;

    if (customerInfo.notes.trim()) {
      msg += `\n📝 *Observações:* ${customerInfo.notes.trim()}\n`;
    }

    msg += `\n_Agradecemos a preferência!_`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    if (!customerInfo.name.trim()) {
      setValidationError('Por favor, informe o seu nome para o pedido.');
      return;
    }
    if (customerInfo.orderType === 'delivery' && !customerInfo.address.trim()) {
      setValidationError('Por favor, indique a morada ou bairro para entrega.');
      return;
    }

    setValidationError('');
    const text = generateWhatsAppMessage();
    const url = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div
        className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#8b1e1e] text-white">
          <div>
            <h2 id="modal-title" className="text-lg font-bold">O Seu Pedido</h2>
            <p className="text-xs text-amber-100/90">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} selecionados
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-red-200 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-black/20 hover:bg-black/30 transition cursor-pointer"
                title="Esvaziar carrinho"
              >
                <Trash2 className="w-3 h-3" />
                <span>Esvaziar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Validation Alert */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 flex-none" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Resumo dos Produtos
            </h3>
            {cartItems.length === 0 ? (
              <p className="text-center py-6 text-stone-500 text-sm">
                O carrinho está vazio. Adicione produtos do catálogo.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
                {cartItems.map(({ product, quantity }) => {
                  const lineTotal = quantity * product.price;
                  return (
                    <div
                      key={product.id}
                      className="p-3 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-stone-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-stone-500">
                          {formatPriceMT(product.price)} / {product.unit}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -product.step)}
                          className="w-6 h-6 rounded bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-8 text-center text-xs font-bold text-stone-800">
                          {quantity} {product.isPerKg ? 'kg' : ''}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, product.step)}
                          className="w-6 h-6 rounded bg-[#8b1e1e] text-white hover:bg-[#731717] flex items-center justify-center font-bold text-xs shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-20">
                        <div className="text-xs sm:text-sm font-bold text-stone-900">
                          {formatPriceMT(lineTotal)}
                        </div>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-[11px] text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Subtotal row */}
                <div className="p-3.5 bg-stone-100 flex items-center justify-between font-bold">
                  <span className="text-stone-700 text-sm">Total Estimado:</span>
                  <span className="text-lg text-[#8b1e1e]">{formatPriceMT(totalPrice)}</span>
                </div>
              </div>
            )}
            <p className="text-[11px] text-stone-500 mt-1.5 italic">
              * Quantidades "por kg" contam em quilogramas. O peso exato e o valor final são confirmados com a equipa da Taha's Fresh Meat no WhatsApp.
            </p>
          </div>

          {/* Customer Information Form */}
          {cartItems.length > 0 && (
            <div className="space-y-3.5 border-t border-stone-200 pt-4">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Dados do Cliente
              </h3>

              {/* Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>O seu nome *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    placeholder="Ex: Carlos Machel"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Contacto telefónico</span>
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    placeholder="Ex: 84 / 82 / 86..."
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              </div>

              {/* Order Type Toggle */}
              <div>
                <label className="text-xs font-semibold text-stone-700 mb-1.5 block">
                  Modalidade do Pedido
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCustomerInfo({ ...customerInfo, orderType: 'delivery' })
                    }
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                      customerInfo.orderType === 'delivery'
                        ? 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>🚚 Entrega ao domicílio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCustomerInfo({ ...customerInfo, orderType: 'pickup' })
                    }
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                      customerInfo.orderType === 'pickup'
                        ? 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>🏪 Levantamento na loja</span>
                  </button>
                </div>
              </div>

              {/* Address (if delivery) */}
              {customerInfo.orderType === 'delivery' && (
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Morada de Entrega (Bairro / Rua / Ponto de ref.) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, address: e.target.value })
                    }
                    placeholder="Ex: Sommerschield, Rua dos Lusíadas, Casa 12"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                  <span>Método de Pagamento Preferido</span>
                </label>
                <select
                  value={customerInfo.paymentMethod}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Emola">e-Mola</option>
                  <option value="Dinheiro na entrega">Dinheiro na entrega</option>
                  <option value="POS / Cartão">POS / Cartão bancário</option>
                  <option value="Transferência Bancária">Transferência Bancária (BIM / BCI / Standard)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Observações (sabores, corte dos bifes, horário)</span>
                </label>
                <textarea
                  rows={2}
                  value={customerInfo.notes}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, notes: e.target.value })
                  }
                  placeholder="Ex: bifes finos, piri-piri forte, entregar até às 16h..."
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2">
          {cartItems.length > 0 ? (
            <>
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Pedido por WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMessage}
                  className="flex-1 py-2 px-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Texto Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copiar Resumo do Pedido</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="py-2 px-4 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition cursor-pointer"
                >
                  Continuar a Escolher
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#8b1e1e] text-white font-semibold text-sm transition cursor-pointer"
            >
              Voltar ao Catálogo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
