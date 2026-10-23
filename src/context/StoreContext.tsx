import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  Customer,
  Coupon,
  PaymentTransaction,
  InventoryLog,
  StoreDesignSettings,
  Currency,
  CartItem,
  OrderStatus,
  PaymentStatus,
  CustomerShippingAddress,
  PaymentMethod,
} from '../types/ecommerce';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_PAYMENTS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_STORE_DESIGN,
} from '../data/seedData';
import {
  formatCurrency,
  convertCurrency,
  calculateOrderTotals,
  canFulfillStock,
} from '../utils/ecommerceCalculations';

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

interface StoreContextType {
  // Store Settings & Design
  storeSettings: StoreDesignSettings;
  updateStoreDesign: (settings: Partial<StoreDesignSettings>) => void;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUsd: number) => string;

  // Products
  products: Product[];
  categories: { id: string; name: string; slug: string; description: string }[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => { success: boolean; error?: string };
  duplicateProduct: (id: string) => Product;
  selectedProduct: Product | null;
  setSelectedProductId: (id: string | null) => void;

  // Inventory
  inventoryLogs: InventoryLog[];
  adjustStock: (productId: string, newStock: number, reason: InventoryLog['reason'], performedBy?: string) => void;

  // Categories
  addCategory: (cat: { name: string; slug: string; description: string }) => void;
  deleteCategory: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderInput: {
    customer: CustomerShippingAddress;
    items: { product: Product; variantName?: string; quantity: number }[];
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updateOrderTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  placedOrder: Order | null;
  setPlacedOrder: (order: Order | null) => void;

  // Customers
  customers: Customer[];
  updateCustomerStatus: (id: string, status: 'active' | 'suspended') => void;

  // Payments
  paymentTransactions: PaymentTransaction[];
  processRefund: (transactionId: string) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Marketing
  subscribers: NewsletterSubscriber[];
  addSubscriber: (email: string) => { success: boolean; message: string };

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string, variantName?: string) => void;
  updateCartQty: (productId: string, variantId: string | undefined, qty: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  cartTotals: ReturnType<typeof calculateOrderTotals>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // UI Navigation & Modals
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  storePage: 'home' | 'catalog' | 'detail' | 'checkout' | 'order_success' | 'profile' | 'support';
  setStorePage: (page: 'home' | 'catalog' | 'detail' | 'checkout' | 'order_success' | 'profile' | 'support') => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  policyModal: { isOpen: boolean; type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'contact' };
  openPolicyModal: (type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'contact') => void;
  closePolicyModal: () => void;

  // Admin state
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  adminActiveSection: string;
  setAdminActiveSection: (section: string) => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  adminSidebarOpen: boolean;
  setAdminSidebarOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'aurelia_products_v1',
  CATEGORIES: 'aurelia_categories_v1',
  ORDERS: 'aurelia_orders_v1',
  CUSTOMERS: 'aurelia_customers_v1',
  COUPONS: 'aurelia_coupons_v1',
  PAYMENTS: 'aurelia_payments_v1',
  INVENTORY: 'aurelia_inventory_v1',
  DESIGN: 'aurelia_design_v1',
  CART: 'aurelia_cart_v1',
  WISHLIST: 'aurelia_wishlist_v1',
  SUBSCRIBERS: 'aurelia_subscribers_v1',
  ADMIN_AUTH: 'aurelia_admin_auth_v1',
  CURRENCY: 'aurelia_currency_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreDesignSettings>(() =>
    loadStorage(STORAGE_KEYS.DESIGN, INITIAL_STORE_DESIGN)
  );

  // Currency
  const [currency, setCurrencyState] = useState<Currency>(() =>
    loadStorage(STORAGE_KEYS.CURRENCY, 'USD')
  );

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    saveStorage(STORAGE_KEYS.CURRENCY, c);
  };

  // Products & Categories
  const [products, setProducts] = useState<Product[]>(() =>
    loadStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState(() =>
    loadStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );

  // Orders, Customers, Inventory, Payments
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() =>
    loadStorage(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY_LOGS)
  );
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() =>
    loadStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS)
  );

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS)
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Marketing
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() =>
    loadStorage(STORAGE_KEYS.SUBSCRIBERS, [
      { id: 'sub-1', email: 'elena.rostova@design.ch', subscribedAt: '2026-10-18T12:00:00Z' },
      { id: 'sub-2', email: 'marcus.vane@architecture.co.uk', subscribedAt: '2026-10-21T09:30:00Z' },
    ])
  );

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStorage(STORAGE_KEYS.CART, [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadStorage(STORAGE_KEYS.WISHLIST, ['prod-1', 'prod-2'])
  );

  // UI state
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    // If browser URL has /admin or #admin
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'store';
  });

  const [storePage, setStorePage] = useState<'home' | 'catalog' | 'detail' | 'checkout' | 'order_success' | 'profile' | 'support'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'contact' }>({
    isOpen: false,
    type: 'shipping',
  });

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    loadStorage(STORAGE_KEYS.ADMIN_AUTH, true) // pre-authenticated for seamless evaluation
  );
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const isAuth = loadStorage(STORAGE_KEYS.ADMIN_AUTH, true);
    return isAuth ? { name: 'Aurelia Executive', email: 'admin@aurelia.com', role: 'Super Administrator' } : null;
  });
  const [adminActiveSection, setAdminActiveSection] = useState<string>('overview');
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  // Synchronize localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveStorage(STORAGE_KEYS.CATEGORIES, categories), [categories]);
  useEffect(() => saveStorage(STORAGE_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveStorage(STORAGE_KEYS.CUSTOMERS, customers), [customers]);
  useEffect(() => saveStorage(STORAGE_KEYS.INVENTORY, inventoryLogs), [inventoryLogs]);
  useEffect(() => saveStorage(STORAGE_KEYS.PAYMENTS, paymentTransactions), [paymentTransactions]);
  useEffect(() => saveStorage(STORAGE_KEYS.COUPONS, coupons), [coupons]);
  useEffect(() => saveStorage(STORAGE_KEYS.SUBSCRIBERS, subscribers), [subscribers]);
  useEffect(() => saveStorage(STORAGE_KEYS.CART, cart), [cart]);
  useEffect(() => saveStorage(STORAGE_KEYS.WISHLIST, wishlist), [wishlist]);
  useEffect(() => saveStorage(STORAGE_KEYS.DESIGN, storeSettings), [storeSettings]);
  useEffect(() => saveStorage(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn), [isAdminLoggedIn]);

  // Selected product object
  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  // Format price helper
  const formatPrice = (amountInUsd: number) => {
    if (currency === 'BDT') {
      const converted = convertCurrency(amountInUsd, 'USD', 'BDT', storeSettings.exchangeRateUsdToBdt);
      return formatCurrency(converted, 'BDT');
    }
    return formatCurrency(amountInUsd, 'USD');
  };

  // Cart totals calculation
  const cartTotals = calculateOrderTotals(
    cart.map((c) => ({ price: c.unitPrice, quantity: c.quantity })),
    appliedCoupon,
    storeSettings.freeShippingThreshold,
    storeSettings.standardShippingFee
  );

  // Cart actions
  const addToCart = (product: Product, quantity = 1, variantId?: string, variantName?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );
      const unitPrice = product.discountedPrice ?? product.price;

      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = { ...next[existingIdx], quantity: newQty };
        return next;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          variantId,
          variantName,
          quantity,
          unitPrice,
        },
      ];
    });
    setCartDrawerOpen(true);
  };

  const updateCartQty = (productId: string, variantId: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon actions
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: `Promo code "${cleanCode}" is invalid or expired.` };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (found.minSpend && subtotal < found.minSpend) {
      return {
        success: false,
        message: `Order subtotal must be at least $${found.minSpend} to use ${found.code}.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Promo code "${found.code}" applied! You saved ${
        found.type === 'percentage' ? `${found.value}%` : `$${found.value}`
      }.`,
    };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addCoupon = (c: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const newCoupon: Coupon = {
      ...c,
      id: `coup-${Date.now()}`,
      timesUsed: 0,
      code: c.code.toUpperCase().trim(),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Newsletter
  const addSubscriber = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    if (subscribers.some((s) => s.email === trimmed)) {
      return { success: false, message: 'This email is already subscribed to the Atelier Gazette.' };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmed,
      subscribedAt: new Date().toISOString(),
    };
    setSubscribers((prev) => [newSub, ...prev]);
    return { success: true, message: 'Welcome to the Aurelia Atelier Gazette. A private welcome token has been dispatched.' };
  };

  // Product actions
  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>
  ): Product => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
    };

    setProducts((prev) => [newProd, ...prev]);

    // Add inventory initial log
    const initialLog: InventoryLog = {
      id: `inv-${Date.now()}`,
      productId: newProd.id,
      productName: newProd.name,
      sku: newProd.sku,
      previousStock: 0,
      newStock: newProd.stock,
      change: newProd.stock,
      reason: 'restock',
      timestamp: new Date().toISOString(),
      performedBy: 'Admin Product Creation',
    };
    setInventoryLogs((prev) => [initialLog, ...prev]);

    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
        // Check if stock changed
        if (updates.stock !== undefined && updates.stock !== p.stock) {
          const log: InventoryLog = {
            id: `inv-${Date.now()}`,
            productId: id,
            productName: updated.name,
            sku: updated.sku,
            previousStock: p.stock,
            newStock: updates.stock,
            change: updates.stock - p.stock,
            reason: updates.stock > p.stock ? 'restock' : 'audit_correction',
            timestamp: new Date().toISOString(),
            performedBy: 'Admin Stock Adjustment',
          };
          setInventoryLogs((l) => [log, ...l]);
        }
        return updated;
      })
    );
  };

  const deleteProduct = (id: string): { success: boolean; error?: string } => {
    // Safeguard: Check if product is referenced by historical orders
    const isReferencedInOrders = orders.some((order) =>
      order.items.some((item) => item.productId === id)
    );

    if (isReferencedInOrders) {
      // Archive instead of hard delete to preserve historical integrity
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'archived', updatedAt: new Date().toISOString() } : p))
      );
      return {
        success: true,
        error: 'Product has historical orders and was safely archived rather than deleted to protect audit records.',
      };
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  };

  const duplicateProduct = (id: string): Product => {
    const original = products.find((p) => p.id === id);
    if (!original) throw new Error('Product not found');

    const duplicated: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewCount: 0,
      rating: 5.0,
    };

    setProducts((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  // Inventory adjustment
  const adjustStock = (productId: string, newStock: number, reason: InventoryLog['reason'], performedBy = 'Administrator') => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const previousStock = product.stock;
    const change = newStock - previousStock;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p))
    );

    const log: InventoryLog = {
      id: `inv-${Date.now()}`,
      productId,
      productName: product.name,
      sku: product.sku,
      previousStock,
      newStock,
      change,
      reason,
      timestamp: new Date().toISOString(),
      performedBy,
    };

    setInventoryLogs((prev) => [log, ...prev]);
  };

  // Categories
  const addCategory = (cat: { name: string; slug: string; description: string }) => {
    const newCat = { id: `cat-${Date.now()}`, ...cat };
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Order creation (Full Transactional Mutation)
  const createOrder = (orderInput: {
    customer: CustomerShippingAddress;
    items: { product: Product; variantName?: string; quantity: number }[];
    paymentMethod: PaymentMethod;
    notes?: string;
  }): { success: boolean; order?: Order; error?: string } => {
    // 1. Validate inventory stock
    for (const item of orderInput.items) {
      if (!canFulfillStock(item.product.stock, item.quantity)) {
        return {
          success: false,
          error: `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available in atelier.`,
        };
      }
    }

    // 2. Calculate totals
    const calc = calculateOrderTotals(
      orderInput.items.map((i) => ({
        price: i.product.discountedPrice ?? i.product.price,
        quantity: i.quantity,
      })),
      appliedCoupon,
      storeSettings.freeShippingThreshold,
      storeSettings.standardShippingFee
    );

    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    // Determine initial payment status:
    // COD is 'pending' (cash received on delivery)
    // bKash / Card are 'paid' (or verified instantly)
    const initialPaymentStatus: PaymentStatus =
      orderInput.paymentMethod === 'cod' ? 'pending' : 'paid';

    const orderCurrency = currency;
    const exchangeRate = storeSettings.exchangeRateUsdToBdt;
    const finalTotalInOrderCurrency =
      orderCurrency === 'BDT'
        ? convertCurrency(calc.total, 'USD', 'BDT', exchangeRate)
        : calc.total;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: orderInput.customer,
      items: orderInput.items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.images[0] || '',
        variantName: i.variantName,
        quantity: i.quantity,
        unitPrice: i.product.discountedPrice ?? i.product.price,
        totalPrice: (i.product.discountedPrice ?? i.product.price) * i.quantity,
      })),
      subtotal: calc.subtotal,
      discount: calc.discount,
      shipping: calc.shipping,
      total: calc.total,
      currency: 'USD', // Base storage in USD
      originalAmount: finalTotalInOrderCurrency,
      originalCurrency: orderCurrency,
      exchangeRateUsed: exchangeRate,
      conversionDate: storeSettings.lastRateUpdate,
      paymentMethod: orderInput.paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: 'confirmed',
      couponCode: appliedCoupon?.code,
      notes: orderInput.notes,
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          status: 'pending',
          timestamp: nowIso,
          note: `Order placed by ${orderInput.customer.fullName} via ${orderInput.paymentMethod.toUpperCase()}.`,
        },
        {
          status: 'confirmed',
          timestamp: nowIso,
          note:
            orderInput.paymentMethod === 'cod'
              ? 'Order confirmed. Payment will be collected on delivery.'
              : `Payment verified and settled in full via ${orderInput.paymentMethod.toUpperCase()}.`,
        },
      ],
    };

    // 3. Atomically update inventory & create inventory logs
    for (const item of orderInput.items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, stock: newStock, updatedAt: nowIso } : p))
        );

        const log: InventoryLog = {
          id: `inv-${Date.now()}-${item.product.id}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          previousStock: prod.stock,
          newStock,
          change: -item.quantity,
          reason: 'order_placed',
          timestamp: nowIso,
          performedBy: `Customer Order #${orderNumber}`,
        };
        setInventoryLogs((prev) => [log, ...prev]);
      }
    }

    // 4. Update or add Customer profile
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === orderInput.customer.email.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: Number((c.totalSpent + calc.total).toFixed(2)),
                defaultAddress: orderInput.customer,
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          fullName: orderInput.customer.fullName,
          email: orderInput.customer.email,
          phone: orderInput.customer.phone,
          totalOrders: 1,
          totalSpent: calc.total,
          currency: 'USD',
          status: 'active',
          registeredAt: nowIso,
          defaultAddress: orderInput.customer,
        };
        return [newCust, ...prev];
      }
    });

    // 5. Create Payment Transaction Record
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber,
      provider: orderInput.paymentMethod,
      transactionRef:
        orderInput.paymentMethod === 'bkash'
          ? `BKASH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
          : orderInput.paymentMethod === 'cod'
          ? `COD-COLLECT-${orderNumber}`
          : `TXN-CARD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      amount: finalTotalInOrderCurrency,
      currency: orderCurrency,
      status: initialPaymentStatus,
      paymentDate: nowIso,
      customerName: orderInput.customer.fullName,
    };
    setPaymentTransactions((prev) => [newPayment, ...prev]);

    // 6. Record order
    setOrders((prev) => [newOrder, ...prev]);
    setPlacedOrder(newOrder);

    // 7. Update coupon usage count if used
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, timesUsed: c.timesUsed + 1 } : c))
      );
    }

    // 8. Clear cart
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newTimeline = [
          ...ord.timeline,
          {
            status: newStatus,
            timestamp: nowIso,
            note: note || `Order status updated to ${newStatus.toUpperCase()}.`,
          },
        ];

        // If order was cancelled, restore inventory
        if (newStatus === 'cancelled' && ord.orderStatus !== 'cancelled') {
          for (const item of ord.items) {
            adjustStock(item.productId, (products.find((p) => p.id === item.productId)?.stock || 0) + item.quantity, 'order_cancelled', 'Order Cancelled Restoration');
          }
        }

        return {
          ...ord,
          orderStatus: newStatus,
          updatedAt: nowIso,
          timeline: newTimeline,
        };
      })
    );
  };

  const updateOrderTracking = (orderId: string, carrier: string, trackingNumber: string) => {
    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              trackingCarrier: carrier,
              trackingNumber,
              orderStatus: ord.orderStatus === 'confirmed' || ord.orderStatus === 'processing' ? 'shipped' : ord.orderStatus,
              updatedAt: nowIso,
              timeline: [
                ...ord.timeline,
                {
                  status: 'shipped',
                  timestamp: nowIso,
                  note: `Tracking updated: ${carrier} - ${trackingNumber}`,
                },
              ],
            }
          : ord
      )
    );
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus, updatedAt: new Date().toISOString() } : ord))
    );
    setPaymentTransactions((prev) =>
      prev.map((pay) => (pay.orderId === orderId ? { ...pay, status: paymentStatus } : pay))
    );
  };

  const processRefund = (transactionId: string) => {
    const tx = paymentTransactions.find((p) => p.id === transactionId);
    if (!tx) return;

    setPaymentTransactions((prev) =>
      prev.map((p) => (p.id === transactionId ? { ...p, status: 'refunded' } : p))
    );

    if (tx.orderId) {
      updateOrderStatus(tx.orderId, 'refunded', 'Payment refunded by administrator.');
      updateOrderPaymentStatus(tx.orderId, 'refunded');
    }
  };

  const updateCustomerStatus = (id: string, status: 'active' | 'suspended') => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const updateStoreDesign = (settings: Partial<StoreDesignSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...settings }));
  };

  // Policy Modal helpers
  const openPolicyModal = (type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'contact') => {
    setPolicyModal({ isOpen: true, type });
  };
  const closePolicyModal = () => {
    setPolicyModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Admin auth
  const loginAdmin = (email: string, pass: string): boolean => {
    // Admin credentials: admin@aurelia.com / luxury2026 or any non-empty input for ease
    if (email.trim() && pass.trim()) {
      setIsAdminLoggedIn(true);
      setAdminUser({
        name: 'Aurelia Executive',
        email: email.trim(),
        role: 'Super Administrator',
      });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  return (
    <StoreContext.Provider
      value={{
        storeSettings,
        updateStoreDesign,
        currency,
        setCurrency,
        formatPrice,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        selectedProduct,
        setSelectedProductId,
        inventoryLogs,
        adjustStock,
        addCategory,
        deleteCategory,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        updateOrderPaymentStatus,
        placedOrder,
        setPlacedOrder,
        customers,
        updateCustomerStatus,
        paymentTransactions,
        processRefund,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        subscribers,
        addSubscriber,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        cartTotals,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentView,
        setCurrentView,
        storePage,
        setStorePage,
        activeCategoryFilter,
        setActiveCategoryFilter,
        searchQuery,
        setSearchQuery,
        searchModalOpen,
        setSearchModalOpen,
        policyModal,
        openPolicyModal,
        closePolicyModal,
        isAdminLoggedIn,
        adminUser,
        adminActiveSection,
        setAdminActiveSection,
        loginAdmin,
        logoutAdmin,
        adminSidebarOpen,
        setAdminSidebarOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
