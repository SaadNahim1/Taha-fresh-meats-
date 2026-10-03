import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
}) => {
  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Procurar carne, picanha, camarão, espetos, queijo..."
          className="w-full pl-10 pr-24 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/30 focus:border-[#8b1e1e] shadow-xs transition"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            title="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
          {resultCount} {resultCount === 1 ? 'item' : 'itens'}
        </div>
      </div>

      {searchTerm && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            Filtrando por: <strong className="text-stone-900">"{searchTerm}"</strong>
          </span>
          <button
            onClick={() => onSearchChange('')}
            className="text-[#8b1e1e] hover:underline font-semibold ml-1 cursor-pointer"
          >
            Mostrar tudo
          </button>
        </div>
      )}
    </div>
  );
};
