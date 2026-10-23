import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerShippingAddress, PaymentMethod } from '../../types/ecommerce';
import { ShieldCheck, Lock, CreditCard, Smartphone, Banknote, ChevronLeft, ArrowRight, Check } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotals,
    formatPrice,
    currency,
    createOrder,
    setStorePage,
    storeSettings,
  } = useStore();

  const [formData, setFormData] = useState<CustomerShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [mobileTrxId, setMobileTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl text-[#1A1918]">Your Atelier Bag is empty</h2>
        <p className="text-xs text-[#78716C]">Please add items from our atelier before proceeding to checkout.</p>
        <button
          onClick={() => setStorePage('catalog')}
          className="px-6 py-2.5 text-xs font-medium text-white bg-[#1A1918] rounded-md cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !mobileTrxId.trim()) {
      setErrorMessage(`Please provide your ${paymentMethod.toUpperCase()} transaction ID (TrxID) for instant verification.`);
      return;
    }

    setIsSubmitting(true);

    const result = createOrder({
      customer: formData,
      items: cart.map((c) => ({
        product: c.product,
        variantName: c.variantName,
        quantity: c.quantity,
      })),
      paymentMethod,
      notes: `${notes}${mobileTrxId ? ` | TrxID: ${mobileTrxId}` : ''}`,
    });

    setIsSubmitting(false);

    if (result.success) {
      setStorePage('order_success');
    } else {
      setErrorMessage(result.error || 'Failed to place order. Please review your details.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Return button */}
      <button
        onClick={() => setStorePage('catalog')}
        className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1A1918] mb-8 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Checkout Forms */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            
            {/* Step 1: Customer Contact & Shipping */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <h2 className="font-editorial text-lg sm:text-xl font-medium text-[#1A1918]">
                  1. Delivery Concierge &amp; Destination
                </h2>
                <span className="text-[11px] text-[#9A7B4F] uppercase tracking-wider font-semibold">
                  Insured Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[#44403C] font-medium mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Genevieve Dupond"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] font-medium mb-1">
                    Email Address (for order tracking) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="client@luxury.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] font-medium mb-1">
                    Direct Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 019-2834 or +880 1711..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#44403C] font-medium mb-1">
                    Street Address &amp; Residence *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="House, building number, street name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] font-medium mb-1">
                    Apartment / Suite (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Suite 4B / Penthouse"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] font-medium mb-1">
                    City / Metro *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Paris, New York, Dhaka..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] font-medium mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State or Province"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] font-medium mb-1">
                    Postal / Zip Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="75008 or 10021"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#44403C] font-medium mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="France">France</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Canada">Canada</option>
                    <option value="Switzerland">Switzerland</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <h2 className="font-editorial text-lg sm:text-xl font-medium text-[#1A1918]">
                  2. Secure Payment Gateway
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-[#16A34A] font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#1A1918] bg-[#F8F6F0] ring-1 ring-[#1A1918]'
                      : 'border-[#DDD5C5] bg-white hover:border-[#9A7B4F]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1918] flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#9A7B4F]" />
                      Cash on Delivery (COD)
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#1A1918]"
                    />
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-normal">
                    Inspect your parcel upon white-glove arrival. Hand cash directly to the courier agent.
                  </p>
                </label>

                {/* bKash Mobile Wallet */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#1A1918] bg-[#F8F6F0] ring-1 ring-[#1A1918]'
                      : 'border-[#DDD5C5] bg-white hover:border-[#9A7B4F]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1918] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#D12053]" />
                      bKash Merchant Pay
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-[#1A1918]"
                    />
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-normal">
                    Official merchant number: 01711-AURELIA. Instant automated verification.
                  </p>
                </label>

                {/* Nagad / Rocket */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#1A1918] bg-[#F8F6F0] ring-1 ring-[#1A1918]'
                      : 'border-[#DDD5C5] bg-white hover:border-[#9A7B4F]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1918] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#EA580C]" />
                      Nagad Financial Service
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="text-[#1A1918]"
                    />
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-normal">
                    Direct electronic transfer to Aurelia Maison Merchant wallet.
                  </p>
                </label>

                {/* International Card / Stripe */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#1A1918] bg-[#F8F6F0] ring-1 ring-[#1A1918]'
                      : 'border-[#DDD5C5] bg-white hover:border-[#9A7B4F]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1918] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#9A7B4F]" />
                      Credit / Debit Card
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#1A1918]"
                    />
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-normal">
                    Visa, Mastercard, Amex, Apple Pay. Zero foreign transaction surcharge.
                  </p>
                </label>

              </div>

              {/* Conditional Mobile Payment instructions */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-4 bg-[#FFFBF0] rounded-xl border border-[#F3E2B8] text-xs space-y-2">
                  <span className="font-semibold text-[#854D0E] block">
                    {paymentMethod.toUpperCase()} Merchant Instructions:
                  </span>
                  <p className="text-[#713F12]">
                    1. Send payment to Aurelia Merchant Account: <strong>01711-234567</strong><br />
                    2. Reference: Your Name or Phone<br />
                    3. Enter your Transaction ID (TrxID) below for instant automated confirmation.
                  </p>
                  <div>
                    <label className="block text-[#854D0E] font-medium mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9K28M981"
                      value={mobileTrxId}
                      onChange={(e) => setMobileTrxId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#F3E2B8] rounded font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Special Delivery Notes */}
              <div>
                <label className="block text-xs text-[#44403C] font-medium mb-1">
                  Atelier Concierge Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, gift packaging message, or delivery scheduling preferences..."
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none"
                />
              </div>

            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 text-sm font-medium text-white bg-[#1A1918] hover:bg-[#2D2A26] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Securing Acquisition...' : 'Place Confirmed Atelier Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-editorial text-lg font-medium text-[#1A1918]">
                Atelier Order Summary
              </h3>
              <span className="text-xs text-[#78716C] font-mono">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>

            {/* Itemized preview */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="flex items-center gap-3 text-xs"
                >
                  <img
                    src={item.product.images[0] || ''}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EB] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1918] truncate">{item.product.name}</p>
                    <span className="text-[#78716C] text-[11px]">
                      {item.variantName ? `${item.variantName} · ` : ''}Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-[#1A1918] tabular-nums">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#F0EBE1] space-y-2 text-xs text-[#57534E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#1A1918] tabular-nums">{formatPrice(cartTotals.subtotal)}</span>
              </div>
              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Privilege Discount</span>
                  <span className="font-mono tabular-nums">-{formatPrice(cartTotals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span className="font-mono text-[#1A1918] tabular-nums">
                  {cartTotals.isFreeShipping ? 'Complimentary' : formatPrice(cartTotals.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1A1918] pt-3 border-t border-[#E8E4DA]">
                <span>Total Due</span>
                <span className="font-mono tabular-nums">{formatPrice(cartTotals.total)}</span>
              </div>

              {/* Currency and exchange note per prompt requirements */}
              <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#EBE7DD] text-[11px] text-[#78716C] space-y-1 mt-3">
                <div className="flex justify-between">
                  <span>Settlement Currency:</span>
                  <strong className="text-[#1A1918]">{currency}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate Reference:</span>
                  <span>1 USD = {storeSettings.exchangeRateUsdToBdt} BDT</span>
                </div>
                <div className="text-[10px] text-[#A8A29E]">
                  Source: {storeSettings.rateSource} ({storeSettings.lastRateUpdate})
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#78716C] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#9A7B4F] shrink-0" />
              <span>Full insurance &amp; tamper-proof seal included.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
