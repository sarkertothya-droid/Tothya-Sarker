import React from 'react';
import { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { Heart, Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { formatPrice, addToCart, toggleWishlist, isInWishlist, setSelectedProductId, setStorePage } = useStore();

  const isFavorited = isInWishlist(product.id);
  const displayImage = product.images[0] || '';
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setStorePage('detail');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#EBE7DD] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-[#F5F2EB] overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#A8A29E]">
            Atelier Photography
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#44403C] hover:text-[#B91C1C] transition-colors shadow-sm cursor-pointer z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#B91C1C] text-[#B91C1C]' : ''}`} />
        </button>

        {/* Quick View Floating Action */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
              else handleCardClick();
            }}
            className="flex-1 py-2 px-3 text-xs font-medium text-[#1A1918] bg-white/95 backdrop-blur-md rounded-lg shadow-sm hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              aria-label={`Quick add ${product.name} to bag`}
              className="p-2 text-white bg-[#1A1918] hover:bg-[#332E2B] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Quiet Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-[11px] text-[#78716C] tracking-wider uppercase font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>★ {product.rating.toFixed(1)}</span>
            {isOutOfStock ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#DC2626]">Awaiting Restock</span>
              </>
            ) : isLowStock ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#D97706]">Only {product.stock} Left</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">·</span>
                <span>In Atelier</span>
              </>
            )}
          </div>

          <h3 className="font-editorial text-base sm:text-lg font-medium text-[#1A1918] group-hover:text-[#9A7B4F] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Price & Primary Buy CTA */}
        <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-semibold text-sm sm:text-base text-[#1A1918] tabular-nums">
              {formatPrice(product.discountedPrice ?? product.price)}
            </span>
            {product.discountedPrice && (
              <span className="font-sans text-xs text-[#A8A29E] line-through tabular-nums">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                : 'text-[#1A1918] hover:text-white bg-[#F5F2EB] hover:bg-[#1A1918]'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
