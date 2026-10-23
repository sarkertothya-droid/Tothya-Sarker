import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronLeft, Check, Sparkles } from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setStorePage,
  } = useStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    selectedProduct?.variants[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craft' | 'shipping'>('details');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-[#78716C]">Product not selected.</p>
        <button
          onClick={() => setStorePage('catalog')}
          className="mt-4 px-4 py-2 text-xs bg-[#1A1918] text-white rounded-md cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const selectedVariant = selectedProduct.variants.find((v) => v.id === selectedVariantId);
  const currentStock = selectedVariant ? selectedVariant.stock : selectedProduct.stock;
  const isOutOfStock = currentStock <= 0;
  const isFavorited = isInWishlist(selectedProduct.id);

  // Price adjustment if variant has offset
  const basePrice = selectedProduct.discountedPrice ?? selectedProduct.price;
  const effectivePrice = basePrice + (selectedVariant?.priceOffset || 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity, selectedVariantId, selectedVariant?.name);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <button
        onClick={() => setStorePage('catalog')}
        className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1A1918] transition-colors mb-8 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Atelier Archive</span>
      </button>

      {/* 2-Column Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Visual Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F2EB] border border-[#E8E4DA] shadow-sm relative">
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded text-xs font-semibold text-[#DC2626]">
                Awaiting Next Atelier Run
              </div>
            )}
          </div>

          {/* Micro trust indicators */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#F8F6F0] rounded-xl border border-[#ECE7DC] text-xs text-[#57534E]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9A7B4F] shrink-0" />
              <span>Artisanal Authenticity</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9A7B4F] shrink-0" />
              <span>Express Insured Courier</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#9A7B4F] shrink-0" />
              <span>30-Day White-Glove Return</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#78716C] uppercase tracking-wider font-medium">
              <span>{selectedProduct.brand} · {selectedProduct.category}</span>
              <span className="font-mono text-[11px] text-[#A8A29E]">SKU: {selectedProduct.sku}</span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-normal tracking-tight">
              {selectedProduct.name}
            </h1>

            {/* Unboxed rating & stock status */}
            <div className="flex items-center gap-3 text-xs text-[#57534E] pt-1">
              <span>★ {selectedProduct.rating.toFixed(2)} ({selectedProduct.reviewCount} client reviews)</span>
              <span aria-hidden="true">·</span>
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Sold Out</span>
              ) : currentStock <= 4 ? (
                <span className="text-amber-700 font-medium">Limited Run: Only {currentStock} remain</span>
              ) : (
                <span className="text-emerald-700 font-medium">In Atelier Stock ({currentStock} available)</span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#ECE7DC]">
            <span className="font-sans text-2xl sm:text-3xl font-semibold text-[#1A1918] tabular-nums">
              {formatPrice(effectivePrice)}
            </span>
            {selectedProduct.discountedPrice && (
              <span className="font-sans text-base text-[#A8A29E] line-through tabular-nums">
                {formatPrice(selectedProduct.price)}
              </span>
            )}
            <span className="text-xs text-[#78716C]">Taxes included · Free shipping over $250</span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#57534E] leading-relaxed font-light">
            {selectedProduct.description}
          </p>

          {/* Variants Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1918] block">
                Select Edition / Spec
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId;
                  const isVarOutOfStock = variant.stock <= 0;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={isVarOutOfStock}
                      className={`p-3 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#1A1918] bg-[#F5F2EB] text-[#1A1918] font-medium'
                          : isVarOutOfStock
                          ? 'border-[#E5E5E5] bg-[#FAFAFA] text-[#A8A29E] cursor-not-allowed'
                          : 'border-[#DDD5C5] hover:border-[#9A7B4F] text-[#44403C]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{variant.name}</span>
                        {variant.priceOffset ? (
                          <span className="font-mono text-[11px] text-[#78716C]">
                            +{formatPrice(variant.priceOffset)}
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-[#A8A29E] block mt-0.5">
                        {isVarOutOfStock ? 'Sold out' : `${variant.stock} left in atelier`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Buy CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#D5CBB8] rounded-md bg-white overflow-hidden text-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-[#44403C] hover:bg-[#F5F2EB] disabled:opacity-40 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 font-mono text-center min-w-[2.5rem] tabular-nums font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3 py-2 text-[#44403C] hover:bg-[#F5F2EB] disabled:opacity-40 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Primary Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-6 text-sm font-medium rounded-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isOutOfStock
                    ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                    : 'bg-[#1A1918] text-[#FAF9F5] hover:bg-[#2D2A26]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Awaiting Atelier Batch' : 'Acquire for Atelier Bag'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                aria-label="Add to wishlist"
                className="p-3 border border-[#D5CBB8] rounded-md hover:bg-[#F5F2EB] transition-colors cursor-pointer text-[#44403C]"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-[#B91C1C] text-[#B91C1C]' : ''}`} />
              </button>
            </div>

            {addedNotice && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-md flex items-center gap-2 border border-emerald-200 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Piece successfully acquired into your Atelier Bag.</span>
              </div>
            )}
          </div>

          {/* Accordion Tabs */}
          <div className="pt-6 border-t border-[#ECE7DC] space-y-4">
            <div className="flex border-b border-[#E2DBD0] text-xs font-medium">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 mr-6 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#1A1918] text-[#1A1918]'
                    : 'border-transparent text-[#78716C] hover:text-[#1A1918]'
                }`}
              >
                Atelier Narrative
              </button>
              <button
                onClick={() => setActiveTab('craft')}
                className={`pb-2 mr-6 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'craft'
                    ? 'border-[#1A1918] text-[#1A1918]'
                    : 'border-transparent text-[#78716C] hover:text-[#1A1918]'
                }`}
              >
                Specifications &amp; Care
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'shipping'
                    ? 'border-[#1A1918] text-[#1A1918]'
                    : 'border-transparent text-[#78716C] hover:text-[#1A1918]'
                }`}
              >
                White-Glove Shipping
              </button>
            </div>

            <div className="text-xs text-[#57534E] leading-relaxed">
              {activeTab === 'details' && (
                <p>{selectedProduct.detailedStory || selectedProduct.description}</p>
              )}
              {activeTab === 'craft' && (
                <div className="space-y-2">
                  <p><strong>Dimensions &amp; Weight:</strong> {selectedProduct.weightDimensions || 'Custom Atelier Proportions'}</p>
                  <p><strong>Care Instructions:</strong> Clean gently with a soft dry microfiber cloth. Avoid direct excessive heat and chemical solvents.</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-1.5">
                  <p>{selectedProduct.shippingInfo || 'Complimentary worldwide express shipping for orders over $250.'}</p>
                  <p className="text-[11px] text-[#78716C]">Orders are meticulously packed in embossed rigid boxes with organic silk lining and certificate of authenticity.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
