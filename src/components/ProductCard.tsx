import React from 'react';
import { Product } from '../types';
import { formatPriceMT } from '../data/catalog';
import { Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onUpdateQuantity,
}) => {
  const isInCart = quantity > 0;
  const itemTotal = quantity * product.price;

  return (
    <div
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all ${
        isInCart
          ? 'bg-amber-50/50 border-[#8b1e1e]/60 shadow-xs'
          : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow-xs'
      }`}
    >
      {/* Product Details */}
      <div className="flex-1 pr-3 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          {product.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded border border-amber-300/60">
              {product.badge}
            </span>
          )}
          {isInCart && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
              <Check className="w-2.5 h-2.5" /> No carrinho
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-stone-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-bold text-[#8b1e1e]">
            {formatPriceMT(product.price)}
          </span>
          <span className="text-xs text-stone-500 font-normal">
            / {product.unit}
          </span>
        </div>

        {isInCart && (
          <div className="mt-1 text-[11px] font-medium text-stone-600">
            Subtotal: <span className="font-bold text-stone-800">{formatPriceMT(itemTotal)}</span>
          </div>
        )}
      </div>

      {/* Quantity Stepper Controls */}
      <div className="flex items-center gap-1.5 flex-none bg-stone-50 p-1 rounded-xl border border-stone-200">
        {isInCart ? (
          <>
            <button
              onClick={() => onUpdateQuantity(-product.step)}
              className="w-8 h-8 rounded-lg bg-stone-200 text-stone-800 hover:bg-stone-300 active:scale-90 flex items-center justify-center font-bold text-base transition"
              title="Diminuir quantidade"
              aria-label="Diminuir"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="min-w-10 text-center font-bold text-xs sm:text-sm text-stone-900 select-none">
              {quantity} {product.isPerKg ? 'kg' : ''}
            </span>

            <button
              onClick={() => onUpdateQuantity(product.step)}
              className="w-8 h-8 rounded-lg bg-[#8b1e1e] text-white hover:bg-[#731717] active:scale-90 flex items-center justify-center font-bold text-base shadow-xs transition"
              title="Aumentar quantidade"
              aria-label="Aumentar"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onUpdateQuantity(product.step)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8b1e1e] hover:bg-[#731717] active:scale-95 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
            title="Adicionar ao pedido"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        )}
      </div>
    </div>
  );
};
