import React from 'react';
import { ChevronLeft, LayoutDashboard, Layers, UtensilsCrossed, Gift, Package, Star } from 'lucide-react';
import { useAdminMenu, adminMenuActions } from '../../context/AdminMenuContext';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const { state, dispatch } = useAdminMenu();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'menu-items', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'featured', label: 'Featured Content', icon: Star },
    { id: 'offers', label: 'Offers', icon: Gift },
    { id: 'combos', label: 'Combos', icon: Package },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 h-screen flex flex-col transition-all duration-300 ease-in-out fixed lg:relative z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h2 className="font-bold text-lg">MenuHub</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = state.activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  dispatch(adminMenuActions.setActiveTab(item.id));
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="px-4 py-6 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4 text-center text-sm">
            <p className="text-gray-300 mb-2">Version 1.0</p>
            <p className="text-gray-500 text-xs">© 2026 Sangameshwar Cafe</p>
          </div>
        </div>
      </aside>
    </>
  );
}
