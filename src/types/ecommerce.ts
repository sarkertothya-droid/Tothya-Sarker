export type Currency = 'USD' | 'BDT';

export interface ProductVariant {
  id: string;
  name: string; // e.g., "50ml", "100ml" or "Cognac", "Black"
  priceOffset?: number; // additional price if any
  sku?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailedStory?: string;
  price: number; // Stored in USD base
  discountedPrice?: number;
  currency: Currency;
  sku: string;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  weightDimensions?: string;
  shippingInfo?: string;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-2026-8812
  customer: CustomerShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: Currency;
  originalAmount: number;
  originalCurrency: Currency;
  exchangeRateUsed: number;
  conversionDate: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  currency: Currency;
  status: 'active' | 'suspended';
  registeredAt: string;
  defaultAddress?: CustomerShippingAddress;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  provider: PaymentMethod;
  transactionRef: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentDate: string;
  customerName: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 15 for 15%) or fixed dollar amount
  minSpend?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  categorySpecific?: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: 'restock' | 'order_placed' | 'order_cancelled' | 'damage' | 'audit_correction' | 'return';
  timestamp: string;
  performedBy: string;
}

export interface StoreDesignSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  accentColor: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImageUrl: string;
  announcementText: string;
  showAnnouncement: boolean;
  featuredCollectionTitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerBio: string;
  instagramHandle: string;
  pinterestHandle: string;
  currency: Currency;
  exchangeRateUsdToBdt: number;
  rateSource: string;
  lastRateUpdate: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
}
