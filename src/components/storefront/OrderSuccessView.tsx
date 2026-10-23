import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Printer, ArrowRight, Package, Truck, ShieldCheck } from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { placedOrder, formatPrice, setStorePage } = useStore();

  if (!placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm text-[#78716C]">No recent order found.</p>
        <button
          onClick={() => setStorePage('home')}
          className="px-5 py-2 text-xs bg-[#1A1918] text-white rounded-md cursor-pointer"
        >
          Return to Atelier
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-sm overflow-hidden">
        
        {/* Success Hero */}
        <div className="p-8 sm:p-10 text-center bg-[#FAF9F5] border-b border-[#E8E4DA] space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7B4F] block">
            Acquisition Confirmed
          </span>

          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1918] font-normal">
            Thank You, {placedOrder.customer.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto">
            Your atelier requisition has been registered under reference{' '}
            <strong className="text-[#1A1918] font-mono">{placedOrder.orderNumber}</strong>. A receipt and provenance certificate have been queued to {placedOrder.customer.email}.
          </p>
        </div>

        {/* Order Progress Timeline */}
        <div className="p-6 sm:p-8 border-b border-[#F0EBE1] space-y-4">
          <h2 className="font-editorial text-base sm:text-lg text-[#1A1918] font-medium">
            Atelier Preparation Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#ECE7DC] space-y-1">
              <span className="font-semibold text-[#1A1918] block">1. Registered</span>
              <span className="text-[11px] text-emerald-700">✓ Received in system</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#ECE7DC] space-y-1">
              <span className="font-semibold text-[#1A1918] block">2. Verified</span>
              <span className="text-[11px] text-emerald-700">
                {placedOrder.paymentStatus === 'paid' ? '✓ Payment settled' : '✓ COD Approved'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#ECE7DC] space-y-1">
              <span className="font-semibold text-[#1A1918] block">3. Packaging</span>
              <span className="text-[11px] text-[#78716C]">Silk-lined box wrap</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#ECE7DC] space-y-1">
              <span className="font-semibold text-[#1A1918] block">4. Courier</span>
              <span className="text-[11px] text-[#78716C]">White-glove dispatch</span>
            </div>
          </div>
        </div>

        {/* Itemized Order Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              Acquisition Summary
            </h3>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1A1918] bg-[#F5F2EB] px-3 py-1.5 rounded-md cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="space-y-3">
            {placedOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-[#F5F2EB]">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-md object-cover bg-[#F5F2EB]"
                  />
                  <div>
                    <span className="font-medium text-[#1A1918] block">{item.productName}</span>
                    <span className="text-[11px] text-[#78716C]">
                      {item.variantName ? `${item.variantName} · ` : ''}Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-medium text-[#1A1918] tabular-nums">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-xs text-[#57534E] pt-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatPrice(placedOrder.subtotal)}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Privilege Discount ({placedOrder.couponCode})</span>
                <span className="font-mono tabular-nums">-{formatPrice(placedOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Delivery</span>
              <span className="font-mono tabular-nums">
                {placedOrder.shipping === 0 ? 'Complimentary' : formatPrice(placedOrder.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#1A1918] pt-2 border-t border-[#E8E4DA]">
              <span>Amount Recorded</span>
              <span className="font-mono tabular-nums">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>

          {/* Shipping and Payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF9F5] rounded-xl border border-[#ECE7DC] text-xs">
            <div>
              <span className="text-[#78716C] uppercase text-[10px] tracking-wider block font-semibold mb-1">
                Destination Concierge
              </span>
              <p className="font-medium text-[#1A1918]">{placedOrder.customer.fullName}</p>
              <p className="text-[#57534E]">{placedOrder.customer.street}</p>
              <p className="text-[#57534E]">
                {placedOrder.customer.city}, {placedOrder.customer.postalCode}, {placedOrder.customer.country}
              </p>
              <p className="text-[#78716C] mt-1">{placedOrder.customer.phone}</p>
            </div>

            <div>
              <span className="text-[#78716C] uppercase text-[10px] tracking-wider block font-semibold mb-1">
                Payment Verification
              </span>
              <p className="font-medium text-[#1A1918] uppercase">
                Method: {placedOrder.paymentMethod}
              </p>
              <p className="text-[#57534E]">
                Status:{' '}
                <strong
                  className={placedOrder.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}
                >
                  {placedOrder.paymentStatus.toUpperCase()}
                </strong>
              </p>
              <p className="text-[11px] text-[#78716C] mt-1">
                Order Currency: {placedOrder.originalCurrency} ({placedOrder.originalAmount})
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#FAF9F5] border-t border-[#E8E4DA] flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => setStorePage('profile')}
            className="text-xs text-[#57534E] hover:text-[#1A1918] underline cursor-pointer"
          >
            Track in Client Portal
          </button>

          <button
            onClick={() => setStorePage('catalog')}
            className="px-6 py-2.5 text-xs font-medium text-white bg-[#1A1918] hover:bg-[#2D2A26] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Return to Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
