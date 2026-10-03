import { useState, useEffect, useMemo } from 'react';
import { ALL_PRODUCTS, CATEGORIES } from './data/catalog';
import { Product, CartItem } from './types';
import { DEFAULT_WHATSAPP_NUMBER } from './assets/logo';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryChips } from './components/CategoryChips';
import { QuickFilters } from './components/QuickFilters';
import { ProductCard } from './components/ProductCard';
import { CartFloatingBar } from './components/CartFloatingBar';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { GitHubModal } from './components/GitHubModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { ShareModal } from './components/ShareModal';
import { StoreFaq } from './components/StoreFaq';
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  HelpCircle,
  ShoppingBag,
  Flame,
  ArrowUp,
  Settings,
  Share2,
  Phone,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // WhatsApp destination number
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>(() => {
    return localStorage.getItem('tahas_whatsapp') || DEFAULT_WHATSAPP_NUMBER;
  });

  // Category and Search state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [activeSpecialFilter, setActiveSpecialFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tahas_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    localStorage.setItem('tahas_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveWhatsApp = (num: string) => {
    setWhatsAppNumber(num);
    localStorage.setItem('tahas_whatsapp', num);
  };

  // Update product quantity in cart
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, Math.round((current + delta) * 10) / 10);
      const copy = { ...prev };
      if (next <= 0) {
        delete copy[productId];
      } else {
        copy[productId] = next;
      }
      return copy;
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Convert raw cart map to rich CartItem objects
  const cartItems: CartItem[] = useMemo(() => {
    const items: CartItem[] = [];
    Object.entries(cart).forEach(([id, quantity]) => {
      if (quantity > 0) {
        const product = ALL_PRODUCTS.find((p) => p.id === id);
        if (product) {
          items.push({ product, quantity });
        }
      }
    });
    return items;
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  }, [cartItems]);

  const handleSelectSpecialFilter = (filterType: string) => {
    setActiveSpecialFilter(filterType);
    if (filterType === 'all') {
      setSelectedCategoryId('');
    } else if (filterType === 'vaca') {
      setSelectedCategoryId('0');
    } else if (filterType === 'temperadas') {
      setSelectedCategoryId('1');
    } else if (filterType === 'marisco') {
      setSelectedCategoryId('2');
    } else if (filterType === 'frango') {
      setSelectedCategoryId('8');
    } else {
      setSelectedCategoryId('');
    }
  };

  // Filter products by category, special filter, and search
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Special filter
      if (activeSpecialFilter === 'destaques' && !product.popular) {
        return false;
      }

      // Category filter
      const matchesCategory =
        selectedCategoryId === '' || product.categoryId === selectedCategoryId;

      // Search term
      const cleanTerm = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !cleanTerm ||
        product.name.toLowerCase().includes(cleanTerm) ||
        product.category.toLowerCase().includes(cleanTerm);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, activeSpecialFilter, searchTerm]);

  // Counts per category for the filter pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_PRODUCTS.forEach((product) => {
      const cleanTerm = searchTerm.toLowerCase().trim();
      if (
        !cleanTerm ||
        product.name.toLowerCase().includes(cleanTerm) ||
        product.category.toLowerCase().includes(cleanTerm)
      ) {
        counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [searchTerm]);

  // Group displayed products by category
  const groupedProducts = useMemo(() => {
    const groups: { category: string; categoryId: string; products: Product[] }[] = [];
    const map = new Map<string, Product[]>();

    filteredProducts.forEach((p) => {
      if (!map.has(p.categoryId)) {
        map.set(p.categoryId, []);
      }
      map.get(p.categoryId)!.push(p);
    });

    CATEGORIES.forEach((cat) => {
      const prods = map.get(cat.id);
      if (prods && prods.length > 0) {
        groups.push({
          category: cat.name,
          categoryId: cat.id,
          products: prods,
        });
      }
    });

    return groups;
  }, [filteredProducts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf6f2] text-[#2b2b2b] flex flex-col font-sans pb-28">
      {/* Header */}
      <Header whatsAppNumber={whatsAppNumber} />

      {/* Trust & Guarantee Banner */}
      <div className="bg-amber-100/80 border-b border-amber-200/90 text-amber-950 py-2.5 px-4 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 flex-none">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-none" />
            <span>100% Halal Certificado</span>
          </div>
          <div className="flex items-center gap-1.5 flex-none">
            <Truck className="w-4 h-4 text-[#8b1e1e] flex-none" />
            <span>Entregas Rápidas em Maputo & Matola</span>
          </div>
          <div className="flex items-center gap-1.5 flex-none">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-none" />
            <span>Pesagem e Corte no Próprio Dia</span>
          </div>
          <div className="flex items-center gap-1.5 flex-none">
            <MessageCircle className="w-4 h-4 text-emerald-700 flex-none" />
            <span>Confirmação Imediata no WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Sticky Search and Category Navigation */}
      <div className="sticky top-0 z-30 bg-[#faf6f2]/95 backdrop-blur-md border-b border-stone-200 shadow-2xs py-3 px-4">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            resultCount={filteredProducts.length}
          />
          <QuickFilters
            onSelectSpecialFilter={handleSelectSpecialFilter}
            activeSpecialFilter={activeSpecialFilter}
          />
          <CategoryChips
            categories={CATEGORIES}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              if (activeSpecialFilter === 'destaques') {
                setActiveSpecialFilter('all');
              }
            }}
            categoryCounts={categoryCounts}
            totalCount={ALL_PRODUCTS.length}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 py-5 flex-1 space-y-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Não encontramos resultados para "{searchTerm}". Experimente outra pesquisa ou limpe os filtros.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoryId('');
                setActiveSpecialFilter('all');
              }}
              className="px-4 py-2 bg-[#8b1e1e] text-white rounded-xl text-xs font-semibold hover:bg-[#731717] transition cursor-pointer"
            >
              Ver todos os produtos
            </button>
          </div>
        ) : (
          groupedProducts.map((group) => (
            <section
              key={group.categoryId}
              id={`cat-${group.categoryId}`}
              className="scroll-mt-36"
            >
              <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#8b1e1e]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#8b1e1e]">
                    {group.category}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                  {group.products.length} {group.products.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={cart[product.id] || 0}
                    onUpdateQuantity={(delta) => updateQuantity(product.id, delta)}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        {/* Store FAQ */}
        <StoreFaq />

        {/* Butcher Store Contact & Location Card */}
        <section className="bg-stone-900 text-stone-200 rounded-2xl p-5 sm:p-6 shadow-md border border-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Horário de Funcionamento</span>
              </h3>
              <p className="text-stone-400">Segunda a Sábado: 08:00 - 18:30</p>
              <p className="text-stone-400">Domingo: 08:00 - 13:00</p>
              <p className="text-emerald-400 font-semibold mt-1">● Aberto para encomendas</p>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Zonas de Entrega</span>
              </h3>
              <p className="text-stone-400">Maputo Cidade, Polana, Sommerschield</p>
              <p className="text-stone-400">Costa do Sol, Triunfo e Matola</p>
              <p className="text-amber-300 font-semibold mt-1">Entrega grátis para pedidos grandes</p>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Contacto Direto</span>
              </h3>
              <p className="text-stone-400">WhatsApp: +{whatsAppNumber}</p>
              <p className="text-stone-400">Atendimento personalizado para restaurantes, eventos e famílias.</p>
              <a
                href={`https://wa.me/${whatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline"
              >
                Conversar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Cart Bar */}
      <CartFloatingBar
        totalItems={totalCartCount}
        totalPrice={totalCartPrice}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-4 bottom-24 z-30 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white shadow-lg flex items-center justify-center transition cursor-pointer"
          title="Voltar ao topo"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white/80 py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-semibold text-stone-800">
            Taha's Fresh Meat · Carne 100% Halal
          </p>
          <p>
            Catálogo digital de encomendas diretas por WhatsApp · Maputo, Moçambique
          </p>

          {/* Admin / Presentation controls */}
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-stone-100 text-[11px] flex-wrap">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-[#8b1e1e] hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partilhar / Mostrar ao Cliente (QR Code)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-stone-600 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Número do WhatsApp (+{whatsAppNumber})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="text-stone-600 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Conectar com GitHub</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalPrice={totalCartPrice}
        whatsAppNumber={whatsAppNumber}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <StoreSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentWhatsApp={whatsAppNumber}
        onSaveWhatsApp={handleSaveWhatsApp}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        publicUrl={window.location.href}
      />
    </div>
  );
}
