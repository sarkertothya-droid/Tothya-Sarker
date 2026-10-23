import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    products,
    formatPrice,
    setSelectedProductId,
    setStorePage,
  } = useStore();

  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => p.status === 'published')
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [products, query]);

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={() => setSearchModalOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E8E4DA] shadow-2xl overflow-hidden z-10 animate-fadeIn">
        <div className="p-4 border-b border-[#E8E4DA] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9A7B4F] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search perfumes, leather bags, ceramic vessels, cashmere..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-[#1A1918] placeholder-[#A8A29E]"
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            aria-label="Close search"
            className="p-1 text-[#78716C] hover:text-[#1A1918] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs text-[#78716C]">
              <span>Popular searches: </span>
              <button
                onClick={() => setQuery('perfume')}
                className="underline hover:text-[#1A1918] ml-1 cursor-pointer"
              >
                Grasse Perfume
              </button>
              ,
              <button
                onClick={() => setQuery('leather')}
                className="underline hover:text-[#1A1918] ml-1 cursor-pointer"
              >
                Tuscan Leather
              </button>
              ,
              <button
                onClick={() => setQuery('ceramic')}
                className="underline hover:text-[#1A1918] ml-1 cursor-pointer"
              >
                Ceramic Vessels
              </button>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#78716C]">
              No atelier creations found matching "{query}".
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProductId(p.id);
                    setSearchModalOpen(false);
                    setStorePage('detail');
                  }}
                  className="flex items-center gap-4 p-2.5 hover:bg-[#FAF9F5] rounded-xl cursor-pointer transition-colors"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EB]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-editorial text-sm font-medium text-[#1A1918] truncate block">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-[#78716C]">
                      {p.category} · In Stock ({p.stock})
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#1A1918] tabular-nums">
                    {formatPrice(p.discountedPrice ?? p.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
