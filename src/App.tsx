import { useState, useEffect, useMemo } from 'react';
import { ALL_PRODUCTS, CATEGORIES } from './data/catalog';
import { Product, CartItem } from './types';
import { DEFAULT_WHATSAPP_NUMBER } from './assets/logo';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryChips } from './components/CategoryChips';
import { ProductCard } from './components/ProductCard';
import { CartFloatingBar } from './components/CartFloatingBar';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { GitHubModal } from './components/GitHubModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  Flame,
  ArrowUp
} from 'lucide-react';

export default function App() {
  // WhatsApp destination number
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>(() => {
    return localStorage.getItem('tahas_whatsapp') || DEFAULT_WHATSAPP_NUMBER;
  });

  // Category and Search state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
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

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategoryId === '' || product.categoryId === selectedCategoryId;

      const matchesSearch =
        !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, searchTerm]);

  // Counts per category for the filter pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_PRODUCTS.forEach((product) => {
      if (
        !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase().trim())
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
      <Header
        whatsAppNumber={whatsAppNumber}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Trust & Guarantee Banner */}
      <div className="bg-amber-100/70 border-b border-amber-200/80 text-amber-950 py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 text-xs font-medium overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 flex-none">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-none" />
            <span>Carne 100% Halal Certificada</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 flex-none">
            <Truck className="w-4 h-4 text-[#8b1e1e] flex-none" />
            <span>Entregas rápidas em Maputo e Matola</span>
          </div>
          <div className="flex items-center gap-1.5 flex-none">
            <MessageCircle className="w-4 h-4 text-emerald-700 flex-none" />
            <span>Confirmação direta no WhatsApp</span>
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
          <CategoryChips
            categories={CATEGORIES}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
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
              Não encontramos resultados para a pesquisa "{searchTerm}". Tente outra palavra ou limpe o filtro.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoryId('');
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

        {/* How Ordering Works Section */}
        <section className="mt-12 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Como funciona a encomenda?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-bold text-stone-900 block mb-1">
                1. Escolha os cortes e produtos
              </span>
              Selecione as quantidades pretendidas (em kg ou unidades) diretamente no catálogo.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-bold text-stone-900 block mb-1">
                2. Indique nome e morada
              </span>
              Clique em "Finalizar Pedido" para preencher o seu nome e opção de entrega ou levantamento.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-bold text-stone-900 block mb-1">
                3. Envio por WhatsApp
              </span>
              O pedido é enviado pronto para o WhatsApp do talho para pesagem e entrega imediata.
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
      <footer className="mt-auto border-t border-stone-200/80 bg-white/70 py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-stone-800">
            Taha's Fresh Meat · Carne 100% Halal
          </p>
          <p>
            Catálogo digital de encomendas diretas por WhatsApp · Moçambique (+{whatsAppNumber})
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 text-[11px]">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="text-[#8b1e1e] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Conectar com GitHub</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Alterar número WhatsApp
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
    </div>
  );
}
