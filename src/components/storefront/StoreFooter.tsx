import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { storeSettings, openPolicyModal, setStorePage, setActiveCategoryFilter, setCurrentView } = useStore();

  return (
    <footer className="bg-[#1C1A18] text-[#D8D2C4] border-t border-[#2D2A26] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2D2A26]">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-editorial text-2xl text-white font-medium tracking-wider block">
              {storeSettings.logoText || 'AURELIA'}
            </span>
            <p className="text-xs text-[#A8A29E] leading-relaxed max-w-sm font-light">
              {storeSettings.footerBio ||
                'Aurelia Maison honors heritage craftsmanship, architectural balance, and the quiet beauty of raw natural materials. Hand-crafted in limited atelier runs across Paris, Grasse, and Florence.'}
            </p>
            <div className="space-y-1.5 text-xs text-[#8E877E] pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{storeSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{storeSettings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{storeSettings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Curated Disciplines */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-white">
              Atelier Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('Fragrance & Scents');
                    setStorePage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Grasse Parfums
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('Handcrafted Leather');
                    setStorePage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tuscan Leather Totes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('Ceramic & Sculptural Decor');
                    setStorePage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Architectural Stoneware
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('Textiles & Cashmere');
                    setStorePage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mongolian Combed Cashmere
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-white">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => openPolicyModal('shipping')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Insured White-Glove Shipping
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('returns')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Complimentary 30-Day Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Atelier Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => setStorePage('profile')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Client Account &amp; Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Administration */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-white">
              Legal &amp; Management
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => openPolicyModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.history.pushState(null, '', '/admin');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-white underline cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Control Center</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© 2026 {storeSettings.storeName}. All rights reserved worldwide.</p>
          <div className="flex items-center gap-6">
            <span>{storeSettings.instagramHandle}</span>
            <span>{storeSettings.pinterestHandle}</span>
            <span>Paris · Florence · Dhaka · New York</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
