import React from 'react';
import { formatPriceMT } from '../data/catalog';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CartFloatingBarProps {
  totalItems: number;
  totalPrice: number;
  onOpenCheckout: () => void;
}

export const CartFloatingBar: React.FC<CartFloatingBarProps> = ({
  totalItems,
  totalPrice,
  onOpenCheckout,
}) => {
  if (totalItems === 0) return null;

  return (
    <aside
      aria-label="Barra de encomendas e carrinho"
      className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-300/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Cart total summary */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-xl bg-[#8b1e1e] text-white flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
              {totalItems}
            </span>
          </div>

          <div>
            <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
              {totalItems} {totalItems === 1 ? 'produto selecionado' : 'produtos selecionados'}
            </div>
            <div className="text-base sm:text-lg font-black text-[#8b1e1e]">
              {formatPriceMT(totalPrice)}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCheckout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-sm shadow-md transition cursor-pointer"
        >
          <span>Finalizar Pedido</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
