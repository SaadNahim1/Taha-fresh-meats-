import React, { useRef } from 'react';
import { Category } from '../types';
import {
  Flame,
  Sparkles,
  Fish,
  Sandwich,
  Utensils,
  UtensilsCrossed,
  Beef,
  PackageCheck,
  Egg,
  Disc,
  Layers,
  Wheat,
  Cookie,
  Grid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const props = { className: "w-3.5 h-3.5" };
    switch (iconName) {
      case 'Flame':
        return <Flame {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Fish':
      case 'FishSymbol':
        return <Fish {...props} />;
      case 'Sandwich':
        return <Sandwich {...props} />;
      case 'Utensils':
        return <Utensils {...props} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed {...props} />;
      case 'Beef':
        return <Beef {...props} />;
      case 'PackageCheck':
        return <PackageCheck {...props} />;
      case 'Egg':
        return <Egg {...props} />;
      case 'Disc':
        return <Disc {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Wheat':
        return <Wheat {...props} />;
      case 'Cookie':
        return <Cookie {...props} />;
      default:
        return <Grid {...props} />;
    }
  };

  return (
    <div className="relative group">
      {/* Scroll left button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Rolar para esquerda"
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-stone-200 items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All categories pill */}
        <button
          onClick={() => onSelectCategory('')}
          className={`flex items-center gap-1.5 flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
            selectedCategoryId === ''
              ? 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Todos</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategoryId === ''
                ? 'bg-white/20 text-white'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Individual category pills */}
        {categories.map((category) => {
          const count = categoryCounts[category.id] || 0;
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-1.5 flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                isSelected
                  ? 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              {getCategoryIcon(category.iconName)}
              <span>{category.shortName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scroll right button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Rolar para direita"
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-stone-200 items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
