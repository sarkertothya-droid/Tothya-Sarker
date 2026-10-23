import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/storefront/Header';
import { AnnouncementBar } from './components/storefront/AnnouncementBar';
import { HeroBanner } from './components/storefront/HeroBanner';
import { FeaturedCollection } from './components/storefront/FeaturedCollection';
import { BrandStory } from './components/storefront/BrandStory';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailView } from './components/storefront/ProductDetailView';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutView } from './components/storefront/CheckoutView';
import { OrderSuccessView } from './components/storefront/OrderSuccessView';
import { CustomerProfileView } from './components/storefront/CustomerProfileView';
import { SearchModal } from './components/storefront/SearchModal';
import { StoreFooter } from './components/storefront/StoreFooter';
import { PolicyModal } from './components/storefront/PolicyModal';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminAddProduct } from './components/admin/AdminAddProduct';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminRevenueAnalytics } from './components/admin/AdminRevenueAnalytics';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminWebsiteDesign } from './components/admin/AdminWebsiteDesign';
import { AdminMarketing } from './components/admin/AdminMarketing';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminProfile } from './components/admin/AdminProfile';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    storePage,
    isAdminLoggedIn,
    adminActiveSection,
  } = useStore();

  // Listen to browser URL path changes (e.g. /admin)
  useEffect(() => {
    const handleLocation = () => {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };

    window.addEventListener('popstate', handleLocation);
    handleLocation();

    return () => window.removeEventListener('popstate', handleLocation);
  }, [setCurrentView]);

  // If in Admin Control Center
  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin />;
    }

    return (
      <AdminLayout>
        {adminActiveSection === 'overview' && <AdminOverview />}
        {adminActiveSection === 'products' && <AdminProducts />}
        {adminActiveSection === 'add_product' && <AdminAddProduct />}
        {adminActiveSection === 'categories' && <AdminCategories />}
        {adminActiveSection === 'orders' && <AdminOrders />}
        {adminActiveSection === 'customers' && <AdminCustomers />}
        {adminActiveSection === 'payments' && <AdminPayments />}
        {adminActiveSection === 'revenue' && <AdminRevenueAnalytics />}
        {adminActiveSection === 'inventory' && <AdminInventory />}
        {adminActiveSection === 'coupons' && <AdminCoupons />}
        {adminActiveSection === 'website_design' && <AdminWebsiteDesign />}
        {adminActiveSection === 'marketing' && <AdminMarketing />}
        {adminActiveSection === 'reports' && <AdminReports />}
        {adminActiveSection === 'settings' && <AdminSettings />}
        {adminActiveSection === 'admin_profile' && <AdminProfile />}
      </AdminLayout>
    );
  }

  // Public Storefront View
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between selection:bg-[#EAE4D7] selection:text-[#1A1918]">
      <div>
        <AnnouncementBar />
        <Header />

        <main>
          {storePage === 'home' && (
            <>
              <HeroBanner />
              <FeaturedCollection />
              <BrandStory />
            </>
          )}

          {storePage === 'catalog' && <ProductGrid />}

          {storePage === 'detail' && <ProductDetailView />}

          {storePage === 'checkout' && <CheckoutView />}

          {storePage === 'order_success' && <OrderSuccessView />}

          {storePage === 'profile' && <CustomerProfileView />}
        </main>
      </div>

      <StoreFooter />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <PolicyModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
