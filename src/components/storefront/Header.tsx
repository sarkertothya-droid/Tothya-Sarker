import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Heart, User, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    storeSettings,
    cart,
    wishlist,
    currency,
    setCurrency,
    setCartDrawerOpen,
    setSearchModalOpen,
    setStorePage,
    setActiveCategoryFilter,
    setCurrentView,
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E4DA] transition-all">
      {/* Top Bar following the Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setStorePage('home');
            setActiveCategoryFilter('all');
          }}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-wider text-[#1A1918] group-hover:text-[#9A7B4F] transition-colors whitespace-nowrap shrink-0">
            {storeSettings.logoText || 'AURELIA'}
          </span>
          <span className="block text-[10px] tracking-[0.25em] text-[#78716C] uppercase font-sans">
            Maison &amp; Atelier
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#292524]">
          <button
            onClick={() => {
              setActiveCategoryFilter('all');
              setStorePage('catalog');
            }}
            className="hover:text-[#9A7B4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            All Creations
          </button>
          <button
            onClick={() => {
              setActiveCategoryFilter('Fragrance & Scents');
              setStorePage('catalog');
            }}
            className="hover:text-[#9A7B4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Fragrance
          </button>
          <button
            onClick={() => {
              setActiveCategoryFilter('Handcrafted Leather');
              setStorePage('catalog');
            }}
            className="hover:text-[#9A7B4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Leather Goods
          </button>
          <button
            onClick={() => {
              setActiveCategoryFilter('Ceramic & Sculptural Decor');
              setStorePage('catalog');
            }}
            className="hover:text-[#9A7B4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Home Atelier
          </button>
          <button
            onClick={() => {
              setActiveCategoryFilter('Textiles & Cashmere');
              setStorePage('catalog');
            }}
            className="hover:text-[#9A7B4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Fine Cashmere
          </button>
        </nav>

        {/* Zone 3: Primary actions & Controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Currency Switcher */}
          <div className="flex items-center border border-[#DCD6C8] rounded-md overflow-hidden text-xs font-medium">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-[#1A1918] text-[#FAF9F5]'
                  : 'bg-transparent text-[#57534E] hover:text-[#1A1918]'
              }`}
              title="View in US Dollars ($)"
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency('BDT')}
              className={`px-2 py-1 transition-colors cursor-pointer ${
                currency === 'BDT'
                  ? 'bg-[#1A1918] text-[#FAF9F5]'
                  : 'bg-transparent text-[#57534E] hover:text-[#1A1918]'
              }`}
              title="View in Bangladeshi Taka (৳)"
            >
              BDT ৳
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            aria-label="Search collection"
            className="p-2 text-[#44403C] hover:text-[#1A1918] hover:bg-[#F0EBE1] rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => setStorePage('profile')}
            aria-label={`Wishlist (${wishlist.length} items)`}
            className="relative p-2 text-[#44403C] hover:text-[#1A1918] hover:bg-[#F0EBE1] rounded-full transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#9A7B4F] text-white rounded-full text-[10px] font-mono flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            aria-label={`Shopping Bag with ${totalCartCount} items`}
            className="relative p-2 text-[#44403C] hover:text-[#1A1918] hover:bg-[#F0EBE1] rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1A1918] text-white rounded-full text-[10px] font-mono flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Customer Profile */}
          <button
            onClick={() => setStorePage('profile')}
            aria-label="Customer Account & Orders"
            className="p-2 text-[#44403C] hover:text-[#1A1918] hover:bg-[#F0EBE1] rounded-full transition-colors hidden sm:inline-flex cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Dedicated Admin Center Button */}
          <button
            onClick={() => {
              setCurrentView('admin');
              window.history.pushState(null, '', '/admin');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A1918] bg-[#EFE9DB] hover:bg-[#E4DBC8] border border-[#D5CBB8] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            title="Open Executive Admin Control Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span className="hidden md:inline">Admin</span> Portal
          </button>

        </div>
      </div>
    </header>
  );
};
