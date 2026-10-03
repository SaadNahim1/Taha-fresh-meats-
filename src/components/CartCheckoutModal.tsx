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
  AlertCircle,
  Truck,
  Clock,
  Sparkles
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

const DELIVERY_ZONES = [
  { id: 'maputo_centro', name: 'Maputo Cidade (Polana, Sommerschield, Central, Coop)', fee: 150, freeAbove: 2500 },
  { id: 'costa_do_sol', name: 'Costa do Sol, Triunfo, Dona Alice', fee: 200, freeAbove: 3000 },
  { id: 'matola', name: 'Matola (Centro, Rio Cávado, Malhampsene)', fee: 250, freeAbove: 3500 },
  { id: 'outra', name: 'Outra Zona / Arredores (a calcular no WhatsApp)', fee: 0, freeAbove: 0 },
];

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

  const [selectedZoneId, setSelectedZoneId] = useState<string>('maputo_centro');
  const [preferredTime, setPreferredTime] = useState<string>('O mais breve possível');
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const currentZone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const isFreeDelivery =
    customerInfo.orderType === 'delivery' &&
    currentZone.freeAbove > 0 &&
    totalPrice >= currentZone.freeAbove;

  const deliveryFee =
    customerInfo.orderType === 'pickup'
      ? 0
      : isFreeDelivery
      ? 0
      : currentZone.fee;

  const grandTotal = totalPrice + deliveryFee;

  const generateWhatsAppMessage = () => {
    let msg = `🥩 *NOVO PEDIDO - TAHA'S FRESH MEAT* 🥩\n`;
    msg += `Carne 100% Halal Certificada\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `👤 *Cliente:* ${customerInfo.name.trim()}\n`;
    if (customerInfo.phone.trim()) {
      msg += `📱 *Telefone:* ${customerInfo.phone.trim()}\n`;
    }

    if (customerInfo.orderType === 'delivery') {
      msg += `🚚 *Modalidade:* Entrega ao Domicílio\n`;
      msg += `📍 *Zona:* ${currentZone.name}\n`;
      msg += `🏠 *Endereço:* ${customerInfo.address.trim()}\n`;
    } else {
      msg += `🏪 *Modalidade:* Levantamento no Talho\n`;
    }

    msg += `⏰ *Horário Preferido:* ${preferredTime}\n`;
    msg += `💳 *Método de Pagamento:* ${customerInfo.paymentMethod}\n\n`;

    msg += `🛒 *PRODUTOS ESCOLHIDOS:*\n`;
    cartItems.forEach((item) => {
      const lineTotal = item.quantity * item.product.price;
      const unitLabel = item.product.isPerKg ? 'kg' : item.product.unit;
      msg += `• ${item.quantity} ${unitLabel} × ${item.product.name} — ${formatPriceMT(lineTotal)}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📦 Subtotal: ${formatPriceMT(totalPrice)}\n`;
    if (customerInfo.orderType === 'delivery') {
      msg += `🛵 Taxa de Entrega: ${
        isFreeDelivery ? 'GRÁTIS (Campanha valor alto)' : deliveryFee > 0 ? formatPriceMT(deliveryFee) : 'A confirmar'
      }\n`;
    }
    msg += `💰 *TOTAL ESTIMADO: ${formatPriceMT(grandTotal)}*\n`;

    if (customerInfo.notes.trim()) {
      msg += `\n📝 *Observações:* ${customerInfo.notes.trim()}\n`;
    }

    msg += `\n_Por favor confirmar a pesagem exata e a disponibilidade. Obrigado!_`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    if (!customerInfo.name.trim()) {
      setValidationError('Por favor, informe o seu nome para o registo do pedido.');
      return;
    }
    if (customerInfo.orderType === 'delivery' && !customerInfo.address.trim()) {
      setValidationError('Por favor, indique a rua, bairro ou ponto de referência para a entrega.');
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
      <div className="w-full sm:max-w-xl max-h-[94vh] sm:max-h-[88vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#8b1e1e] text-white">
          <div>
            <h2 id="modal-title" className="text-lg font-bold flex items-center gap-2">
              <span>Finalizar Encomenda</span>
              <span className="bg-amber-400 text-stone-900 text-[10px] uppercase font-black px-1.5 py-0.2 rounded">
                Halal
              </span>
            </h2>
            <p className="text-xs text-amber-100">
              {cartItems.length} {cartItems.length === 1 ? 'corte selecionado' : 'cortes selecionados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-red-200 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-black/20 hover:bg-black/30 transition cursor-pointer"
                title="Esvaziar carrinho"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpar</span>
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Produtos no Pedido
              </h3>
              <span className="text-[11px] text-stone-400">
                Ajuste os quilos ou quantidades
              </span>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-center py-6 text-stone-500 text-sm">
                O carrinho está vazio. Adicione cortes ou produtos do catálogo.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
                {cartItems.map(({ product, quantity }) => {
                  const lineTotal = quantity * product.price;
                  return (
                    <div
                      key={product.id}
                      className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-stone-50/70 transition"
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
                <div className="p-3 bg-stone-100/90 flex items-center justify-between font-medium text-xs text-stone-700">
                  <span>Subtotal dos produtos:</span>
                  <span className="font-bold text-stone-900">{formatPriceMT(totalPrice)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Information Form */}
          {cartItems.length > 0 && (
            <div className="space-y-4 border-t border-stone-200 pt-4">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Dados para Entrega / Levantamento
              </h3>

              {/* Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Nome Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    placeholder="Ex: Américo Matusse"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Número de Contacto</span>
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    placeholder="Ex: 84 123 4567"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              </div>

              {/* Order Type Toggle */}
              <div>
                <label className="text-xs font-semibold text-stone-700 mb-1.5 block">
                  Como prefere receber?
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
                    <Truck className="w-3.5 h-3.5" />
                    <span>Entrega ao domicílio</span>
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
                    <span>Levantamento na loja</span>
                  </button>
                </div>
              </div>

              {/* Zone and Address (if delivery) */}
              {customerInfo.orderType === 'delivery' && (
                <div className="space-y-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Zona de Entrega</span>
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20"
                    >
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — {zone.fee > 0 ? `${zone.fee} MT` : 'A combinar'}
                          {zone.freeAbove > 0 ? ` (Grátis acima de ${zone.freeAbove} MT)` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Endereço Completo & Ponto de Referência *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, address: e.target.value })
                      }
                      placeholder="Ex: Polana Cimento, Av. Julius Nyerere, Edifício Mar, Apt 4"
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20"
                    />
                  </div>
                </div>
              )}

              {/* Preferred Delivery Time & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Horário Preferido</span>
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20"
                  >
                    <option value="O mais breve possível">O mais breve possível (Hoje)</option>
                    <option value="Manhã (09:00 - 12:00)">Manhã (09:00 - 12:00)</option>
                    <option value="Tarde (14:00 - 17:30)">Tarde (14:00 - 17:30)</option>
                    <option value="Amanhã de manhã">Amanhã de manhã</option>
                    <option value="Para o fim de semana / Churrasco">Para o fim de semana / Churrasco</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                    <span>Forma de Pagamento</span>
                  </label>
                  <select
                    value={customerInfo.paymentMethod}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="e-Mola">e-Mola</option>
                    <option value="Dinheiro no momento da entrega">Dinheiro na entrega</option>
                    <option value="POS / Cartão bancário">POS / Cartão bancário</option>
                    <option value="Transferência Bancária">Transferência Bancária (BIM / BCI / Standard)</option>
                  </select>
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Instruções de Corte ou Observações (opcional)</span>
                </label>
                <textarea
                  rows={2}
                  value={customerInfo.notes}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, notes: e.target.value })
                  }
                  placeholder="Ex: bifes finos para prego, separar picanha em duas embalagens, pouco sal..."
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20"
                />
              </div>

              {/* Order Grand Total Box */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Subtotal das carnes:</span>
                  <span className="font-semibold">{formatPriceMT(totalPrice)}</span>
                </div>
                {customerInfo.orderType === 'delivery' && (
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>Taxa de entrega estimada:</span>
                    <span className="font-semibold">
                      {isFreeDelivery ? (
                        <span className="text-emerald-700 font-bold">GRÁTIS</span>
                      ) : deliveryFee > 0 ? (
                        formatPriceMT(deliveryFee)
                      ) : (
                        'A confirmar'
                      )}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-amber-200 text-sm font-bold text-stone-900">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Total Estimado:</span>
                  </span>
                  <span className="text-base text-[#8b1e1e] font-black">
                    {formatPriceMT(grandTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 italic mt-1">
                  * Os cortes de carne pesados a granel podem ter uma pequena variação de gramas que será confirmada no talho.
                </p>
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
                <span>Enviar Pedido ao Talho no WhatsApp</span>
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
