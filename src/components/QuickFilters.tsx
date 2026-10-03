import React from 'react';
import { Flame, Beef, Sparkles, Fish, Drumstick } from 'lucide-react';

interface QuickFiltersProps {
  onSelectSpecialFilter: (filterType: string) => void;
  activeSpecialFilter: string;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  onSelectSpecialFilter,
  activeSpecialFilter,
}) => {
  const filters = [
    { id: 'all', label: 'Todos os Produtos', icon: null },
    { id: 'destaques', label: '⭐ Mais Populares / Cortes Nobres', icon: Flame },
    { id: 'temperadas', label: '🍢 Carnes Temperadas', icon: Sparkles },
    { id: 'vaca', label: '🥩 Bovinos Frescos', icon: Beef },
    { id: 'marisco', label: '🦐 Camarão & Caranguejo', icon: Fish },
    { id: 'frango', label: '🍗 Frangos & Aves', icon: Drumstick },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
      {filters.map((f) => {
        const isActive = activeSpecialFilter === f.id;
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            onClick={() => onSelectSpecialFilter(f.id)}
            className={`flex items-center gap-1.5 flex-none px-3 py-1 rounded-lg text-xs font-semibold transition border cursor-pointer ${
              isActive
                ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8b1e1e]' : 'text-stone-400'}`} />}
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
};
