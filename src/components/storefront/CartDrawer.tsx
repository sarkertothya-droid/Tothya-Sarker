import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQty,
    removeFromCart,
    cartTotals,
    formatPrice,
    storeSettings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setStorePage,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!cartDrawerOpen) return null;

  const freeShippingThreshold = storeSettings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotals.subtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartTotals.subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoFeedback({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const handleProceedCheckout = () => {
    setCartDrawerOpen(false);
    setStorePage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E2DBD0] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E4DA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#9A7B4F]" />
              <h2 className="font-editorial text-xl font-medium text-[#1A1918]">
                Atelier Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              aria-label="Close bag drawer"
              className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F0EBE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F4F0E8] border-b border-[#ECE7DC] text-xs">
            {cartTotals.isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You have unlocked complimentary insured shipping!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[#57534E]">
                  Add <strong className="text-[#1A1918]">{formatPrice(remainingForFreeShipping)}</strong> more for complimentary delivery.
                </p>
                <div className="w-full bg-[#E5E0D5] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#9A7B4F] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#C5BBAE] mx-auto" />
                <h3 className="font-editorial text-lg text-[#1A1918]">Your Atelier Bag is empty</h3>
                <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                  Explore our curated fragrance, leather, and sculptural home collections.
                </p>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    setStorePage('catalog');
                  }}
                  className="mt-2 px-5 py-2.5 text-xs font-medium text-white bg-[#1A1918] rounded-md hover:bg-[#332E2B] transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-[#EBE7DD] shadow-xs"
                >
                  <img
                    src={item.product.images[0] || ''}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-[#F5F2EB] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-editorial text-sm font-medium text-[#1A1918] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          aria-label="Remove item"
                          className="text-[#A8A29E] hover:text-[#DC2626] transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantName && (
                        <span className="text-[11px] text-[#78716C]">{item.variantName}</span>
                      )}
                      <div className="text-xs font-semibold text-[#1A1918] tabular-nums mt-0.5">
                        {formatPrice(item.unitPrice)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#DDD5C5] rounded bg-[#FAF9F5] text-xs">
                        <button
                          onClick={() => updateCartQty(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#57534E] hover:bg-[#EBE7DD] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 font-mono text-center font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#57534E] hover:bg-[#EBE7DD] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8E4DA] space-y-4">
              
              {/* Promo Code Form */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-[#F8F6F0] rounded-lg border border-[#E2DBD0] text-xs">
                    <div className="flex items-center gap-1.5 text-[#1A1918]">
                      <Tag className="w-3.5 h-3.5 text-[#9A7B4F]" />
                      <span>Code: <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#DC2626] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo / VIP code (e.g. AURELIA10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF9F5] border border-[#DDD5C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-medium text-[#1A1918] bg-[#F5F2EB] hover:bg-[#EBE7DD] border border-[#D5CBB8] rounded-md transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoFeedback && (
                  <p className={`text-[11px] ${promoFeedback.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                    {promoFeedback.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#57534E] pt-2 border-t border-[#F5F2EB]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1A1918] font-medium tabular-nums">
                    {formatPrice(cartTotals.subtotal)}
                  </span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Atelier Privilege Discount</span>
                    <span className="font-mono font-medium tabular-nums">
                      -{formatPrice(cartTotals.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Delivery</span>
                  <span className="font-mono text-[#1A1918] font-medium tabular-nums">
                    {cartTotals.isFreeShipping ? 'Complimentary' : formatPrice(cartTotals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1A1918] pt-2 border-t border-[#E8E4DA]">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base tabular-nums">
                    {formatPrice(cartTotals.total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-6 text-sm font-medium text-[#FAF9F5] bg-[#1A1918] hover:bg-[#2D2A26] rounded-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed to White-Glove Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
