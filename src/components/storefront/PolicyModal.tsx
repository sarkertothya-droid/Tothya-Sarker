import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { policyModal, closePolicyModal, storeSettings } = useStore();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  if (!policyModal.isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      closePolicyModal();
    }, 2000);
  };

  const getTitle = () => {
    switch (policyModal.type) {
      case 'shipping':
        return 'White-Glove Shipping & Delivery';
      case 'returns':
        return 'Complimentary Returns & Exchanges';
      case 'privacy':
        return 'Privacy & Confidentiality Policy';
      case 'terms':
        return 'Terms of Acquisition & Service';
      case 'contact':
        return 'Contact Atelier Concierge';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={closePolicyModal} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-[#FAF9F5] rounded-2xl border border-[#E8E4DA] shadow-2xl p-6 sm:p-8 z-10 max-h-[85vh] overflow-y-auto space-y-5 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
          <h2 className="font-editorial text-xl sm:text-2xl text-[#1A1918] font-normal">
            {getTitle()}
          </h2>
          <button
            onClick={closePolicyModal}
            aria-label="Close dialog"
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F0EBE1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {policyModal.type === 'shipping' && (
          <div className="space-y-3 text-xs text-[#57534E] leading-relaxed">
            <p>
              Every Aurelia piece is shipped in bespoke, temperature-controlled, shock-absorbent packaging. Our logistics network coordinates with DHL Express Luxury, FedEx Priority, and regional specialized white-glove couriers.
            </p>
            <h4 className="font-semibold text-[#1A1918]">Complimentary Threshold</h4>
            <p>
              Acquisitions totaling over ${storeSettings.freeShippingThreshold} receive complimentary insured worldwide shipping. Standard delivery for orders under the threshold is ${storeSettings.standardShippingFee}.
            </p>
            <h4 className="font-semibold text-[#1A1918]">Dispatch Timelines</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Europe &amp; North America: 2–4 business days via DHL Express.</li>
              <li>Asia-Pacific &amp; Middle East: 3–5 business days.</li>
              <li>Domestic Bangladesh (Dhaka): Next-day courier delivery with Cash on Delivery option.</li>
            </ul>
          </div>
        )}

        {policyModal.type === 'returns' && (
          <div className="space-y-3 text-xs text-[#57534E] leading-relaxed">
            <p>
              We want your acquisition to bring lifelong aesthetic joy. If you are not entirely satisfied, you may initiate a complimentary return or exchange within thirty (30) days of receipt.
            </p>
            <h4 className="font-semibold text-[#1A1918]">Return Conditions</h4>
            <p>
              Items must remain in unworn, unaltered condition with original certificates and protective packaging intact. Fragrances must retain their original cellophane seal.
            </p>
            <p>
              To initiate a return, contact concierge@{storeSettings.storeName.toLowerCase().replace(/[^a-z]/g, '')}.com with your order number. A pre-paid courier label will be dispatched.
            </p>
          </div>
        )}

        {policyModal.type === 'privacy' && (
          <div className="space-y-3 text-xs text-[#57534E] leading-relaxed">
            <p>
              Aurelia Maison strictly protects client privacy. We do not sell, rent, or trade your personal data.
            </p>
            <h4 className="font-semibold text-[#1A1918]">Information We Collect</h4>
            <p>
              We collect your name, shipping address, contact phone, and email solely to process, deliver, and verify orders. Financial transactions are securely encrypted via certified payment gateways.
            </p>
            <h4 className="font-semibold text-[#1A1918]">Your Rights</h4>
            <p>
              You may request a copy of your stored records, address modifications, or account deletion at any time by contacting our privacy compliance desk.
            </p>
          </div>
        )}

        {policyModal.type === 'terms' && (
          <div className="space-y-3 text-xs text-[#57534E] leading-relaxed">
            <p>
              By accessing and acquiring items through Aurelia Maison, you agree to our standard terms of artisanal luxury service.
            </p>
            <p>
              All prices are listed in your selected currency (USD or BDT) using documented real-time banking reference conversion rates. Product availability is subject to physical atelier stock.
            </p>
          </div>
        )}

        {policyModal.type === 'contact' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#F5F2EB] rounded-xl text-xs text-[#57534E]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9A7B4F]" />
                <span className="truncate">{storeSettings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9A7B4F]" />
                <span>{storeSettings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9A7B4F]" />
                <span className="truncate">{storeSettings.address}</span>
              </div>
            </div>

            {contactSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thank you. Your inquiry has been routed to our Paris atelier concierge desk.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#44403C] font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Genevieve Dupond"
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>
                <div>
                  <label className="block text-[#44403C] font-medium mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="client@luxury.com"
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>
                <div>
                  <label className="block text-[#44403C] font-medium mb-1">Atelier Inquiry *</label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Inquire about bespoke sizing, wedding registries, private salon visits..."
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#1A1918] hover:bg-[#2D2A26] text-white font-medium rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Concierge Message</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
