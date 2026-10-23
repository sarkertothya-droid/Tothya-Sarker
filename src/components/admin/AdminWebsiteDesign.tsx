import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Palette, Check, Eye, ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react';

export const AdminWebsiteDesign: React.FC = () => {
  const { storeSettings, updateStoreDesign, setCurrentView, setStorePage } = useStore();

  const [formData, setFormData] = useState({ ...storeSettings });
  const [successNote, setSuccessNote] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreDesign(formData);
    setSuccessNote('Website design settings persisted to database and applied to storefront!');
    setTimeout(() => setSuccessNote(''), 3000);
  };

  const handlePreviewStorefront = () => {
    updateStoreDesign(formData);
    setCurrentView('store');
    setStorePage('home');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Atelier Storefront Customizer &amp; Brand Identity
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Edit branding, typography accents, hero imagery, and announcement banners in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviewStorefront}
            className="px-4 py-2 bg-white border border-[#DDD5C5] text-[#1A1918] hover:bg-[#F5F2EB] rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#9A7B4F]" />
            <span>Live Storefront Preview</span>
          </button>
        </div>
      </div>

      {successNote && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Customizer Form */}
      <form onSubmit={handleSave} className="space-y-8 text-xs">
        
        {/* Section 1: Store Brand & Identity */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            1. Brand Identity &amp; Wordmark
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Store Legal Name</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Header Wordmark (Single Line)</label>
              <input
                type="text"
                name="logoText"
                value={formData.logoText}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-serif uppercase tracking-widest"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#44403C] font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Promotional Top Banner */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              2. Promotional Announcement Banner
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="showAnnouncement"
                checked={formData.showAnnouncement}
                onChange={handleChange}
                className="rounded border-[#D5CBB8] text-[#1A1918]"
              />
              <span className="font-medium text-[#1A1918]">Display Top Banner</span>
            </label>
          </div>

          <div>
            <label className="block text-[#44403C] font-semibold mb-1">Banner Announcement Text</label>
            <input
              type="text"
              name="announcementText"
              value={formData.announcementText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
            />
          </div>
        </div>

        {/* Section 3: Homepage Hero Campaign */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            3. Homepage Hero Campaign
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Hero Display Headline</label>
              <input
                type="text"
                name="heroHeadline"
                value={formData.heroHeadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-editorial text-sm"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Hero Editorial Subtitle</label>
              <textarea
                rows={3}
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Hero Image Asset Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="heroImageUrl"
                  value={formData.heroImageUrl}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
                />
              </div>

              {/* Quick Image Preview */}
              <div className="mt-3 aspect-[16/7] rounded-xl overflow-hidden border border-[#E8E4DA] max-w-md bg-[#F5F2EB]">
                <img
                  src={formData.heroImageUrl}
                  alt="Hero Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Featured Collection Section Title</label>
              <input
                type="text"
                name="featuredCollectionTitle"
                value={formData.featuredCollectionTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Concierge & Footer Content */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            4. Concierge, Contact &amp; Social Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Concierge Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Concierge Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#44403C] font-semibold mb-1">Atelier Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Instagram Handle</label>
              <input
                type="text"
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Pinterest Handle</label>
              <input
                type="text"
                name="pinterestHandle"
                value={formData.pinterestHandle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#44403C] font-semibold mb-1">Footer Narrative Bio</label>
              <textarea
                rows={2}
                name="footerBio"
                value={formData.footerBio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded-lg font-medium cursor-pointer shadow-sm"
          >
            Save Design Changes
          </button>
        </div>

      </form>
    </div>
  );
};
