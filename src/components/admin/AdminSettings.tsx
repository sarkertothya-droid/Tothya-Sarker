import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Check, DollarSign } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { storeSettings, updateStoreDesign, currency, setCurrency } = useStore();

  const [exchangeRateInput, setExchangeRateInput] = useState(storeSettings.exchangeRateUsdToBdt);
  const [rateSourceInput, setRateSourceInput] = useState(storeSettings.rateSource);
  const [shippingThresholdInput, setShippingThresholdInput] = useState(storeSettings.freeShippingThreshold);
  const [shippingFeeInput, setShippingFeeInput] = useState(storeSettings.standardShippingFee);
  const [savedNotice, setSavedNotice] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreDesign({
      exchangeRateUsdToBdt: Number(exchangeRateInput),
      rateSource: rateSourceInput.trim(),
      lastRateUpdate: new Date().toISOString().split('T')[0],
      freeShippingThreshold: Number(shippingThresholdInput),
      standardShippingFee: Number(shippingFeeInput),
    });
    setSavedNotice('Store settings saved and updated across calculations.');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#E8E4DA]">
        <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
          Store Configuration &amp; Financial Standards
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Configure currency conversion ratios, shipping rates, and tax policies.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          {savedNotice}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Currency & Exchange Rates */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            Currency &amp; Official Foreign Exchange Standard
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">
                USD to BDT Exchange Rate (৳ per $1 USD)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={exchangeRateInput}
                onChange={(e) => setExchangeRateInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono text-sm"
              />
              <span className="text-[11px] text-[#78716C] mt-1 block">
                Current: 1 USD = ৳{exchangeRateInput} BDT
              </span>
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">
                Documented Exchange Rate Source
              </label>
              <input
                type="text"
                required
                value={rateSourceInput}
                onChange={(e) => setRateSourceInput(e.target.value)}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
              <span className="text-[11px] text-[#78716C] mt-1 block">
                Last updated date is automatically refreshed upon save.
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            Shipping &amp; Logistics Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">
                Free White-Glove Shipping Threshold (USD $)
              </label>
              <input
                type="number"
                min="0"
                required
                value={shippingThresholdInput}
                onChange={(e) => setShippingThresholdInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono"
              />
              <span className="text-[11px] text-[#78716C] mt-1 block">
                Orders equal or exceeding this receive $0 delivery.
              </span>
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">
                Standard Insured Courier Fee (USD $)
              </label>
              <input
                type="number"
                min="0"
                required
                value={shippingFeeInput}
                onChange={(e) => setShippingFeeInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono"
              />
              <span className="text-[11px] text-[#78716C] mt-1 block">
                Applied for orders below the complimentary threshold.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium cursor-pointer"
          >
            Save Store Settings
          </button>
        </div>

      </form>
    </div>
  );
};
