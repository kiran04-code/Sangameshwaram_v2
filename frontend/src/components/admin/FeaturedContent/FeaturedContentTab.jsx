import React from 'react';

export default function FeaturedContentTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frequently Accessed Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Accessed Items</h3>
          <p className="text-gray-600 mb-4">Manage items that appear in the frequently accessed section</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Configure
          </button>
        </div>

        {/* Quick Add Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Add Items</h3>
          <p className="text-gray-600 mb-4">Manage quick add items that appear on menu page</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Configure
          </button>
        </div>

        {/* Best Sellers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Best Sellers</h3>
          <p className="text-gray-600 mb-4">Feature your most popular items</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Configure
          </button>
        </div>

        {/* Promo Banners */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Promo Banners</h3>
          <p className="text-gray-600 mb-4">Create and manage promotional banners</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
