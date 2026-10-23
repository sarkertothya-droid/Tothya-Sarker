import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { addSubscriber } = useStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addSubscriber(email);
    setMessage({ text: res.message, isError: !res.success });
    if (res.success) setEmail('');
  };

  return (
    <section className="bg-[#F4F0E8] border-y border-[#E2DBD0] py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Editorial Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#DDD5C5]">
              <img
                src="/src/assets/images/product_leather_bag_1792740631547.jpg"
                alt="Florentine Leather Atelier Craft"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                <span className="uppercase tracking-[0.2em] text-[#C5A880] text-[10px] block font-semibold mb-1">
                  Atelier Provenance
                </span>
                <p className="font-editorial text-lg sm:text-xl font-normal leading-snug">
                  Every stitch anchored by hand using wax-coated linen threads in Florence &amp; Grasse.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Text & Proof */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-[#9A7B4F] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Atelier Manifesto</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1A1918] font-normal leading-tight [text-wrap:balance]">
              Slow Design Designed for Generations, Not Seasons
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-light">
              We reject transient fast-consumption. Aurelia partners exclusively with master artisans who have preserved generational heritage across French perfumery, Tuscan tanning guilds, and Japanese ceramic kilns.
            </p>

            <div className="grid grid-cols-3 gap-6 py-4 border-y border-[#E2DBD0] text-center">
              <div>
                <span className="font-editorial text-2xl sm:text-3xl text-[#1A1918] block font-semibold">100%</span>
                <span className="text-[11px] text-[#78716C] uppercase tracking-wider">Traceable Materials</span>
              </div>
              <div>
                <span className="font-editorial text-2xl sm:text-3xl text-[#1A1918] block font-semibold">18 Mo.</span>
                <span className="text-[11px] text-[#78716C] uppercase tracking-wider">Perfume Maturation</span>
              </div>
              <div>
                <span className="font-editorial text-2xl sm:text-3xl text-[#1A1918] block font-semibold">Limited</span>
                <span className="text-[11px] text-[#78716C] uppercase tracking-wider">Atelier Batches</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="block text-xs font-semibold tracking-wider uppercase text-[#1A1918] mb-2">
                Join The Aurelia Gazette
              </span>
              <p className="text-xs text-[#78716C] mb-3">
                Receive private invitations to seasonal private salons, atelier previews, and complimentary fragrance cards.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-2.5 text-xs bg-white border border-[#D5CBB8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] text-[#1A1918]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-medium text-white bg-[#1A1918] hover:bg-[#332E2B] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {message && (
                <p className={`mt-2 text-xs flex items-center gap-1 ${message.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                  {!message.isError && <Check className="w-3.5 h-3.5" />}
                  <span>{message.text}</span>
                </p>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
