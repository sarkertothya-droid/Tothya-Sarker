import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight, Compass } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  const { products, storeSettings, setStorePage, setActiveCategoryFilter, setSelectedProductId } = useStore();

  const featured = products.filter((p) => p.isFeatured && p.status === 'published').slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E4DA] gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium tracking-[0.2em] text-[#9A7B4F] uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Objects</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-normal tracking-tight">
            {storeSettings.featuredCollectionTitle || 'Curated Autumn Atelier'}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1 font-light">
            Heirloom pieces hand-selected for architectural purity and exquisite material finish.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveCategoryFilter('all');
            setStorePage('catalog');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1918] hover:text-[#9A7B4F] transition-colors cursor-pointer group"
        >
          <span>View All Atelier Works</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3-Column Luxury Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => {
              setSelectedProductId(p.id);
              setStorePage('detail');
            }}
          />
        ))}
      </div>
    </section>
  );
};
