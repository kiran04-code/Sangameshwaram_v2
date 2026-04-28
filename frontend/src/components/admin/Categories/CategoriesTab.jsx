import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useAdminMenu, adminMenuActions } from '../../../context/AdminMenuContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api/admin`;

export default function CategoriesTab() {
  const { state, dispatch } = useAdminMenu();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      dispatch(adminMenuActions.setCategoriesLoading(true));
      const response = await axios.get(`${API}/categories`);
      dispatch(adminMenuActions.setCategories(response.data.data || response.data));
      dispatch(adminMenuActions.setCategoriesLoading(false));
    } catch (error) {
      console.error('Error fetching categories:', error);
      dispatch(adminMenuActions.setCategoriesLoading(false));
      dispatch(adminMenuActions.setError('Failed to load categories'));
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API}/categories/${categoryId}`);
        dispatch(adminMenuActions.deleteCategory(categoryId));
        dispatch(adminMenuActions.setSuccess('Category deleted successfully'));
      } catch (error) {
        console.error('Error deleting category:', error);
        dispatch(adminMenuActions.setError('Failed to delete category'));
      }
    }
  };

  const filteredCategories = state.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
          <p className="text-gray-600 mt-1">Manage cafe categories</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items Count</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.items_count || 0} items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
