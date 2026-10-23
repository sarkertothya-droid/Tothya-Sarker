import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, Heart, MapPin, Truck, ChevronRight, ExternalLink } from 'lucide-react';

export const CustomerProfileView: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    formatPrice,
    addToCart,
    setPlacedOrder,
    setStorePage,
    setSelectedProductId,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address'>('orders');

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DA] shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F] block">
            Salon Client Membership
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-medium mt-1">
            Genevieve Dupond &amp; Atelier Clients
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Private account tracking, verified acquisitions, and curated wishlist.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#57534E] border-t sm:border-t-0 sm:border-l border-[#F0EBE1] pt-4 sm:pt-0 sm:pl-6">
          <div>
            <span className="block font-semibold text-lg text-[#1A1918] font-mono tabular-nums">
              {orders.length}
            </span>
            <span className="text-[#78716C]">Atelier Orders</span>
          </div>
          <div>
            <span className="block font-semibold text-lg text-[#1A1918] font-mono tabular-nums">
              {wishlist.length}
            </span>
            <span className="text-[#78716C]">Saved Works</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8E4DA] mb-8 text-xs font-medium">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#1A1918] text-[#1A1918] font-semibold'
              : 'border-transparent text-[#78716C] hover:text-[#1A1918]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-[#1A1918] text-[#1A1918] font-semibold'
              : 'border-transparent text-[#78716C] hover:text-[#1A1918]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Curated Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'address'
              ? 'border-[#1A1918] text-[#1A1918] font-semibold'
              : 'border-transparent text-[#78716C] hover:text-[#1A1918]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Default Residences</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[#E8E4DA] p-8">
              <Package className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
              <p className="text-xs text-[#78716C]">No acquisitions recorded yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 sm:p-6 rounded-xl border border-[#E8E4DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#1A1918]">{order.orderNumber}</span>
                    <span aria-hidden="true" className="text-[#D5CBB8]">·</span>
                    <span className="text-[#78716C]">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span aria-hidden="true" className="text-[#D5CBB8]">·</span>
                    <span
                      className={`font-medium uppercase text-[11px] ${
                        order.orderStatus === 'delivered'
                          ? 'text-emerald-700'
                          : order.orderStatus === 'shipped'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.productImage}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EB] border border-[#ECE7DC]"
                        title={item.productName}
                      />
                    ))}
                    <div className="text-xs text-[#57534E] ml-2">
                      <span className="font-medium text-[#1A1918] block">
                        {order.items[0]?.productName}
                        {order.items.length > 1 ? ` + ${order.items.length - 1} other` : ''}
                      </span>
                      <span className="text-[11px] text-[#78716C]">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} total items · Payment:{' '}
                        {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex items-center gap-1.5 text-xs text-[#2563EB] pt-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{order.trackingCarrier || 'Courier'}: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5F2EB]">
                  <span className="font-mono font-semibold text-base text-[#1A1918] tabular-nums">
                    {formatPrice(order.total)}
                  </span>
                  <button
                    onClick={() => {
                      setPlacedOrder(order);
                      setStorePage('order_success');
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#9A7B4F] hover:text-[#1A1918] font-medium cursor-pointer"
                  >
                    <span>View Receipt &amp; Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[#E8E4DA] p-8">
              <Heart className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
              <p className="text-xs text-[#78716C]">Your curated wishlist is empty.</p>
              <button
                onClick={() => setStorePage('catalog')}
                className="mt-3 px-4 py-2 text-xs bg-[#1A1918] text-white rounded-md cursor-pointer"
              >
                Discover Creations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-[#E8E4DA] p-4 flex gap-4 items-center justify-between"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-[#F5F2EB]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial text-sm font-medium text-[#1A1918] truncate">{p.name}</h4>
                    <span className="text-xs font-semibold text-[#1A1918] block mt-0.5">
                      {formatPrice(p.discountedPrice ?? p.price)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setStorePage('detail');
                      }}
                      className="text-[11px] text-[#9A7B4F] hover:underline cursor-pointer mt-1"
                    >
                      View Details
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="px-3 py-1.5 text-xs bg-[#1A1918] text-white rounded-md hover:bg-[#332E2B] transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeTab === 'address' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7B4F] block">
              Primary Residence
            </span>
            <p className="font-semibold text-sm text-[#1A1918]">Genevieve Dupond</p>
            <p className="text-xs text-[#57534E]">42 Rue du Faubourg Saint-Honoré, Apt 4B</p>
            <p className="text-xs text-[#57534E]">Paris, 75008, France</p>
            <p className="text-xs text-[#78716C] mt-2">+33 6 12 34 56 78</p>
          </div>

          <div className="bg-[#FAF9F5] p-5 rounded-xl border border-dashed border-[#D5CBB8] flex flex-col items-center justify-center text-center space-y-2">
            <MapPin className="w-6 h-6 text-[#A8A29E]" />
            <p className="text-xs font-medium text-[#1A1918]">Add Alternate Residence</p>
            <p className="text-[11px] text-[#78716C]">New York Penthouse, Dhaka Villa, or Swiss Chalet</p>
          </div>
        </div>
      )}

    </div>
  );
};
