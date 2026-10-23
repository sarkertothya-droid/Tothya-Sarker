import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant } from '../../types/ecommerce';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Check, Sparkles, Eye } from 'lucide-react';

interface AdminAddProductProps {
  editingProduct?: Product | null;
  onDone?: () => void;
}

export const AdminAddProduct: React.FC<AdminAddProductProps> = ({ editingProduct, onDone }) => {
  const {
    categories,
    addProduct,
    updateProduct,
    setAdminActiveSection,
    setSelectedProductId,
    setCurrentView,
    setStorePage,
  } = useStore();

  const [name, setName] = useState(editingProduct?.name || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [detailedStory, setDetailedStory] = useState(editingProduct?.detailedStory || '');
  const [price, setPrice] = useState<number>(editingProduct?.price || 150);
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(
    editingProduct?.discountedPrice
  );
  const [sku, setSku] = useState(editingProduct?.sku || `AUR-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState(editingProduct?.category || categories[0]?.name || 'Fragrance & Scents');
  const [brand, setBrand] = useState(editingProduct?.brand || 'Aurelia Atelier');
  const [stock, setStock] = useState<number>(editingProduct?.stock ?? 12);
  const [isFeatured, setIsFeatured] = useState<boolean>(editingProduct?.isFeatured ?? true);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(editingProduct?.status || 'published');
  const [tagsString, setTagsString] = useState(editingProduct?.tags?.join(', ') || 'Atelier Exclusive, Artisanal');
  const [weightDimensions, setWeightDimensions] = useState(editingProduct?.weightDimensions || '0.6 kg · 15 x 10 x 8 cm');
  const [shippingInfo, setShippingInfo] = useState(editingProduct?.shippingInfo || 'Complimentary worldwide white-glove courier dispatch.');
  const [seoTitle, setSeoTitle] = useState(editingProduct?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(editingProduct?.seoDescription || '');

  // Images list
  const [images, setImages] = useState<string[]>(
    editingProduct?.images && editingProduct.images.length > 0
      ? editingProduct.images
      : ['/src/assets/images/product_perfume_amber_1792740629951.jpg']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    editingProduct?.variants && editingProduct.variants.length > 0
      ? editingProduct.variants
      : [
          { id: 'v-1', name: 'Standard Edition', stock: 8, priceOffset: 0, sku: `${sku}-STD` },
          { id: 'v-2', name: 'Grand Edition', stock: 4, priceOffset: 45, sku: `${sku}-GRD` },
        ]
  );

  const [notification, setNotification] = useState<{ message: string; isError: boolean } | null>(null);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    const newV: ProductVariant = {
      id: `var-${Date.now()}`,
      name: 'New Variant Spec',
      stock: 5,
      priceOffset: 0,
      sku: `${sku}-${variants.length + 1}`,
    };
    setVariants((prev) => [...prev, newV]);
  };

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSave = (forcedStatus?: 'published' | 'draft') => {
    if (!name.trim()) {
      setNotification({ message: 'Product Name is required.', isError: true });
      return;
    }

    if (price <= 0) {
      setNotification({ message: 'Price must be greater than zero.', isError: true });
      return;
    }

    const finalStatus = forcedStatus || status;
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const productPayload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      detailedStory: detailedStory.trim() || description.trim(),
      price: Number(price),
      discountedPrice: discountedPrice && discountedPrice > 0 ? Number(discountedPrice) : undefined,
      currency: 'USD' as const,
      sku: sku.trim(),
      category,
      brand,
      stock: Number(stock),
      images: images.length > 0 ? images : ['/src/assets/images/product_perfume_amber_1792740629951.jpg'],
      variants,
      tags,
      weightDimensions,
      shippingInfo,
      seoTitle: seoTitle || `${name} | Aurelia Atelier`,
      seoDescription: seoDescription || description,
      isFeatured,
      status: finalStatus,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      setNotification({ message: `"${name}" was successfully updated in database!`, isError: false });
    } else {
      const created = addProduct(productPayload);
      setNotification({ message: `"${name}" persisted to database and published!`, isError: false });
    }

    setTimeout(() => {
      if (onDone) onDone();
      else setAdminActiveSection('products');
    }, 1200);
  };

  const handlePreview = () => {
    if (editingProduct) {
      setSelectedProductId(editingProduct.id);
      setCurrentView('store');
      setStorePage('detail');
    } else {
      handleSave('draft');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onDone ? onDone() : setAdminActiveSection('products'))}
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] bg-white border border-[#DDD5C5] rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
              {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Atelier Creation'}
            </h1>
            <p className="text-xs text-[#78716C]">
              Synchronizes instantly with the live storefront and inventory registers.
            </p>
          </div>
        </div>

        {/* Action Buttons: Save Product, Save as Draft, Preview, Cancel */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => (onDone ? onDone() : setAdminActiveSection('products'))}
            className="px-3.5 py-2 text-xs font-medium text-[#57534E] bg-white hover:bg-[#F5F2EB] border border-[#DDD5C5] rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="px-3.5 py-2 text-xs font-medium text-[#1A1918] bg-[#F5F2EB] hover:bg-[#EBE7DD] border border-[#D5CBB8] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Product</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-4 py-2 text-xs font-medium text-[#1A1918] bg-[#FAF9F5] hover:bg-[#F0EBE1] border border-[#D5CBB8] rounded-md transition-colors cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#332E2B] rounded-md transition-colors cursor-pointer shadow-xs"
          >
            Save &amp; Publish Product
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 text-xs rounded-xl flex items-center gap-2 ${
            notification.isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {!notification.isError && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        
        {/* Left Column (8 cols): Main details, media, variants */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Information */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F5F2EB] pb-2">
              Atelier General Information
            </h3>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Product Title *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Luna Ambre Doré Eau de Parfum"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] text-[#1A1918] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Short Description *</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize olfactory notes, leather grain, or sculptural form..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] text-[#1A1918] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">
                Extended Craftsmanship Narrative &amp; Provenance
              </label>
              <textarea
                rows={4}
                value={detailedStory}
                onChange={(e) => setDetailedStory(e.target.value)}
                placeholder="Details regarding 18-month perfume maceration, Florentine saddle stitching, kiln firing..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] text-[#1A1918] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
              />
            </div>
          </div>

          {/* Product Media Gallery */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F5F2EB] pb-2">
              Product Images &amp; Visuals
            </h3>

            {/* Existing images list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E8E4DA] group bg-[#F5F2EB]">
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded font-medium">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add new image */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL or asset path (/src/assets/images/...)"
                className="flex-1 px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#F5F2EB] hover:bg-[#EBE7DD] border border-[#D5CBB8] text-[#1A1918] font-medium rounded-md cursor-pointer"
              >
                Add Image
              </button>
            </div>

            {/* Quick Presets for Ease */}
            <div className="text-[11px] text-[#78716C] pt-1">
              <span>Quick Luxury Presets: </span>
              <button
                type="button"
                onClick={() => setImages(['/src/assets/images/product_perfume_amber_1792740629951.jpg'])}
                className="text-[#9A7B4F] underline ml-1 cursor-pointer"
              >
                Amber Perfume
              </button>
              ,
              <button
                type="button"
                onClick={() => setImages(['/src/assets/images/product_leather_bag_1792740631547.jpg'])}
                className="text-[#9A7B4F] underline ml-1 cursor-pointer"
              >
                Leather Tote
              </button>
              ,
              <button
                type="button"
                onClick={() => setImages(['/src/assets/images/product_ceramic_vase_1792740631270.jpg'])}
                className="text-[#9A7B4F] underline ml-1 cursor-pointer"
              >
                Fluted Ceramic
              </button>
              ,
              <button
                type="button"
                onClick={() => setImages(['/src/assets/images/product_cashmere_throw_1792740632099.jpg'])}
                className="text-[#9A7B4F] underline ml-1 cursor-pointer"
              >
                Cashmere Throw
              </button>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F5F2EB] pb-2">
              Pricing, SKU &amp; Inventory Registers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Regular Price (USD $) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Discounted Price (Optional)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountedPrice ?? ''}
                  onChange={(e) => setDiscountedPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Leave empty if none"
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#44403C] font-semibold mb-1">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5] font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
                />
              </div>
            </div>
          </div>

          {/* Variants Management */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-2">
              <h3 className="font-editorial text-base text-[#1A1918] font-medium">
                Product Variants (Flacon Size, Shade, Material)
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-[#9A7B4F] hover:text-[#1A1918] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.id} className="p-3 bg-[#FAF9F5] rounded-xl border border-[#ECE7DC] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-[#78716C] mb-0.5">Variant Title</label>
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => handleUpdateVariant(v.id, { name: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-[#DDD5C5] rounded"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-[#78716C] mb-0.5">Stock</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(v.id, { stock: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-[#DDD5C5] rounded font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-[#78716C] mb-0.5">Price Offset ($)</label>
                    <input
                      type="number"
                      value={v.priceOffset || 0}
                      onChange={(e) => handleUpdateVariant(v.id, { priceOffset: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-[#DDD5C5] rounded font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Category, status, SEO, metadata */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publication Status & Visibility */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F5F2EB] pb-2">
              Status &amp; Placement
            </h3>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5] cursor-pointer"
              >
                <option value="published">Published (Visible on storefront)</option>
                <option value="draft">Draft (Admin eyes only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#D5CBB8] text-[#1A1918]"
                />
                <span className="font-medium text-[#1A1918]">Featured on Homepage Showcase</span>
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F5F2EB] pb-2">
              Physical Specifications
            </h3>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Weight &amp; Dimensions</label>
              <input
                type="text"
                value={weightDimensions}
                onChange={(e) => setWeightDimensions(e.target.value)}
                placeholder="e.g. 0.85 kg · 22 x 14 cm"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Shipping Guidelines</label>
              <input
                type="text"
                value={shippingInfo}
                onChange={(e) => setShippingInfo(e.target.value)}
                placeholder="Courier packaging specifications..."
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="Grasse, Perfume, Handcrafted..."
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F5F2EB] pb-2">
              Search Engine Optimization (SEO)
            </h3>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Luna Ambre Doré Eau de Parfum | Aurelia"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Luxury amber perfume blended with Italian bergamot..."
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded-md bg-[#FAF9F5]"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
