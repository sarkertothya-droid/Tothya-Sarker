import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    categories,
    activeCategoryFilter,
    setActiveCategoryFilter,
    setSelectedProductId,
    setStorePage,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(500);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'published')
      .filter((p) => {
        if (activeCategoryFilter !== 'all' && p.category !== activeCategoryFilter) {
          return false;
        }
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        const effectivePrice = p.discountedPrice ?? p.price;
        if (effectivePrice > priceMax) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice ?? a.price;
        const priceB = b.discountedPrice ?? b.price;

        if (sortBy === 'price_low') return priceA - priceB;
        if (sortBy === 'price_high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, activeCategoryFilter, inStockOnly, priceMax, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold tracking-[0.25em] text-[#9A7B4F] uppercase block mb-1">
          The Full Atelier Archive
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1918] font-normal tracking-tight">
          Timeless Artisanal Catalog
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-2 font-light">
          Filter by discipline, provenance, and material specifications.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Tabs (Segmented Control Buttons per Frontend Design Constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-[#1A1918] text-white shadow-sm'
                : 'text-[#57534E] hover:text-[#1A1918] bg-[#F5F2EB]'
            }`}
          >
            All Creations ({products.filter((p) => p.status === 'published').length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name && p.status === 'published').length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.name)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === cat.name
                    ? 'bg-[#1A1918] text-white shadow-sm'
                    : 'text-[#57534E] hover:text-[#1A1918] bg-[#F5F2EB]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Sorting & Availability Filter Controls */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          {/* In Stock toggle */}
          <label className="flex items-center gap-2 text-[#44403C] cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-[#D5CBB8] text-[#1A1918] focus:ring-[#9A7B4F]"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-[#F5F2EB] px-2.5 py-1.5 rounded-lg border border-[#E2DBD0]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#78716C]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs font-medium text-[#1A1918] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

      </div>

      {/* Products Display Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E8E4DA] p-8">
          <Filter className="w-10 h-10 text-[#A8A29E] mx-auto mb-3" />
          <h3 className="font-editorial text-lg text-[#1A1918]">No creations match your filter criteria</h3>
          <p className="text-xs text-[#78716C] mt-1 mb-4">Try clearing active category filters or price caps.</p>
          <button
            onClick={() => {
              setActiveCategoryFilter('all');
              setInStockOnly(false);
              setPriceMax(500);
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-[#1A1918] rounded-md cursor-pointer hover:bg-[#332E2B]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => {
                setSelectedProductId(p.id);
                setStorePage('detail');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
