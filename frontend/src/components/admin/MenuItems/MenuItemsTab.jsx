import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useAdminMenu, adminMenuActions } from '../../../context/AdminMenuContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api/admin`;

export default function MenuItemsTab() {
  const { state, dispatch } = useAdminMenu();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      dispatch(adminMenuActions.setMenuItemsLoading(true));
      const response = await axios.get(`${API}/menu-items`);
      dispatch(adminMenuActions.setMenuItems(response.data.data || response.data));
      dispatch(adminMenuActions.setMenuItemsLoading(false));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      dispatch(adminMenuActions.setMenuItemsLoading(false));
      dispatch(adminMenuActions.setError('Failed to load menu items'));
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API}/menu-items/${itemId}`);
        dispatch(adminMenuActions.deleteMenuItem(itemId));
        dispatch(adminMenuActions.setSuccess('Menu item deleted successfully'));
      } catch (error) {
        console.error('Error deleting item:', error);
        dispatch(adminMenuActions.setError('Failed to delete menu item'));
      }
    }
  };

  const filteredItems = state.menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Items Management</h2>
          <p className="text-gray-600 mt-1">Manage all food items on your menu</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{item.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.is_veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_veg ? '🌱 Veg' : '🍗 Non-Veg'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No menu items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
