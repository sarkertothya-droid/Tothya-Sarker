import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { storeSettings, setStorePage, setActiveCategoryFilter } = useStore();

  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] border-b border-[#E8E4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-[#9A7B4F] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn Atelier Edition 2026</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1918] leading-[1.1] font-normal tracking-tight [text-wrap:balance]">
              {storeSettings.heroHeadline || 'Curators of Living Poetry & Enduring Craft'}
            </h1>

            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl font-light">
              {storeSettings.heroSubtitle ||
                'Explore our latest collection of limited Grasse perfumes, hand-stitched Florentine leather, and architectural stoneware designed to elevate daily ritual.'}
            </p>

            {/* Primary Action & Category Quick Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setActiveCategoryFilter('all');
                  setStorePage('catalog');
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-[#FAF9F5] bg-[#1A1918] hover:bg-[#2D2A26] rounded-md transition-all shadow-sm hover:shadow group cursor-pointer"
              >
                <span>Explore The Atelier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveCategoryFilter('Fragrance & Scents');
                  setStorePage('catalog');
                }}
                className="px-6 py-3.5 text-sm font-medium text-[#1A1918] bg-transparent hover:bg-[#F0EBE1] border border-[#D5CBB8] rounded-md transition-colors cursor-pointer"
              >
                Artisanal Scents
              </button>
            </div>

            {/* Quiet trust indicators */}
            <div className="pt-6 border-t border-[#ECE7DC] grid grid-cols-2 gap-4 text-xs text-[#78716C]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9A7B4F] shrink-0" />
                <span>Complimentary insured shipping over $250</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9A7B4F] shrink-0" />
                <span>Verified provenance &amp; master atelier warranty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#EBE7DD] border border-[#DDD5C5]">
              <img
                src={storeSettings.heroImageUrl || '/src/assets/images/hero_luxury_editorial_1792740629820.jpg'}
                alt="Aurelia luxury interior and artisanal collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-white/50 text-xs text-[#292524] flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Salon Privé Edition</span>
                  <span className="text-[#78716C] text-[11px]">Parisian Atelier · Natural Oak &amp; Marble</span>
                </div>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('Ceramic & Sculptural Decor');
                    setStorePage('catalog');
                  }}
                  className="text-[#9A7B4F] hover:text-[#1A1918] font-medium text-xs underline cursor-pointer"
                >
                  View Decor
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
