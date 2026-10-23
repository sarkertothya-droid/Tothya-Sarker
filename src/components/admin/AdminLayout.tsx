import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  Boxes,
  Tag,
  Palette,
  Megaphone,
  FileBarChart,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    adminActiveSection,
    setAdminActiveSection,
    adminSidebarOpen,
    setAdminSidebarOpen,
    adminUser,
    logoutAdmin,
    setCurrentView,
    currency,
    setCurrency,
    storeSettings,
  } = useStore();

  const navItems = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'products', label: '2. Products', icon: Package },
    { id: 'add_product', label: '3. Add New Product', icon: PlusCircle },
    { id: 'categories', label: '4. Categories', icon: FolderTree },
    { id: 'orders', label: '5. Orders', icon: ShoppingBag },
    { id: 'customers', label: '6. Customers', icon: Users },
    { id: 'payments', label: '7. Payments', icon: CreditCard },
    { id: 'revenue', label: '8. Revenue Analytics', icon: TrendingUp },
    { id: 'inventory', label: '9. Inventory', icon: Boxes },
    { id: 'coupons', label: '10. Coupons & Discounts', icon: Tag },
    { id: 'website_design', label: '11. Website Design', icon: Palette },
    { id: 'marketing', label: '12. Marketing', icon: Megaphone },
    { id: 'reports', label: '13. Reports', icon: FileBarChart },
    { id: 'settings', label: '14. Settings', icon: Settings },
    { id: 'admin_profile', label: '15. Admin Profile', icon: UserCheck },
  ];

  const handleNavClick = (id: string) => {
    setAdminActiveSection(id);
    setAdminSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1918] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#1C1A18] text-[#FAF9F5] px-4 py-3 flex items-center justify-between border-b border-[#2D2A26] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
            className="p-1.5 text-stone-300 hover:text-white rounded-md cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {adminSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-editorial text-lg font-semibold tracking-wider text-white">
            AURELIA ADMIN
          </span>
        </div>

        <button
          onClick={() => {
            setCurrentView('store');
            window.history.pushState(null, '', '/');
          }}
          className="text-xs text-[#C5A880] flex items-center gap-1 cursor-pointer"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Persistent Left Sidebar (Desktop) & Smooth Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#1C1A18] text-[#D8D2C4] border-r border-[#2D2A26] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Store Link */}
        <div>
          <div className="p-5 border-b border-[#2D2A26] flex items-center justify-between">
            <div>
              <span className="font-editorial text-xl font-semibold tracking-wider text-white block">
                {storeSettings.logoText || 'AURELIA'}
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#A8A29E] uppercase block font-sans">
                Executive Control Center
              </span>
            </div>
            <button
              onClick={() => setAdminSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 16 Nav Items (Strictly matches requirement!) */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminActiveSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-[#C5A880] text-[#1A1918] font-semibold shadow-xs'
                      : 'text-[#A8A29E] hover:text-white hover:bg-[#282522]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A1918]' : 'text-[#8E877E] group-hover:text-white'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#1A1918] shrink-0" />}
                </button>
              );
            })}

            {/* Item 16: Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[#DC2626] hover:bg-red-950/30 transition-colors cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>16. Logout</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile & Return to Store */}
        <div className="p-4 border-t border-[#2D2A26] bg-[#161413] text-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <span className="font-semibold text-white block truncate">{adminUser?.name || 'Administrator'}</span>
              <span className="text-[10px] text-[#8E877E] truncate block">{adminUser?.email || 'admin@aurelia.com'}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Active Session" />
          </div>

          <button
            onClick={() => {
              setCurrentView('store');
              window.history.pushState(null, '', '/');
            }}
            className="w-full py-2 px-3 text-center text-xs font-medium text-[#C5A880] hover:text-white bg-[#24211E] hover:bg-[#2E2A27] rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Preview Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Executive Header Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E8E4DA] px-6 lg:px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-lg font-medium text-[#1A1918] capitalize">
              {adminActiveSection.replace('_', ' ')}
            </span>
            <span className="text-xs text-[#78716C]">· Real-time Database Synchronized</span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Quick USD / BDT Currency Toggle */}
            <div className="flex items-center border border-[#DDD5C5] rounded-md overflow-hidden text-xs font-medium">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 cursor-pointer transition-colors ${
                  currency === 'USD'
                    ? 'bg-[#1A1918] text-white'
                    : 'bg-white text-[#57534E] hover:text-[#1A1918]'
                }`}
                title="Admin metrics in USD"
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('BDT')}
                className={`px-2.5 py-1 cursor-pointer transition-colors ${
                  currency === 'BDT'
                    ? 'bg-[#1A1918] text-white'
                    : 'bg-white text-[#57534E] hover:text-[#1A1918]'
                }`}
                title="Admin metrics in BDT"
              >
                BDT (৳)
              </button>
            </div>

            {/* Quick Add Product Button */}
            <button
              onClick={() => setAdminActiveSection('add_product')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#332E2B] rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>

            {/* Store Preview */}
            <button
              onClick={() => {
                setCurrentView('store');
                window.history.pushState(null, '', '/');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1A1918] bg-[#F5F2EB] px-3 py-1.5 rounded-md border border-[#E2DBD0] cursor-pointer"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
