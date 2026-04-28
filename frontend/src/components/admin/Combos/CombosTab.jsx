import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useAdminMenu, adminMenuActions } from '../../../context/AdminMenuContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api/admin`;

export default function CombosTab() {
  const { state, dispatch } = useAdminMenu();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      dispatch(adminMenuActions.setCombosLoading(true));
      const response = await axios.get(`${API}/combos`);
      dispatch(adminMenuActions.setCombos(response.data.data || response.data));
      dispatch(adminMenuActions.setCombosLoading(false));
    } catch (error) {
      console.error('Error fetching combos:', error);
      dispatch(adminMenuActions.setCombosLoading(false));
      dispatch(adminMenuActions.setError('Failed to load combos'));
    }
  };

  const handleDelete = async (comboId) => {
    if (window.confirm('Are you sure you want to delete this combo?')) {
      try {
        await axios.delete(`${API}/combos/${comboId}`);
        dispatch(adminMenuActions.deleteCombo(comboId));
        dispatch(adminMenuActions.setSuccess('Combo deleted successfully'));
      } catch (error) {
        console.error('Error deleting combo:', error);
        dispatch(adminMenuActions.setError('Failed to delete combo'));
      }
    }
  };

  const filteredCombos = state.combos.filter(combo =>
    combo.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Combos Management</h2>
          <p className="text-gray-600 mt-1">Create and manage combo offers</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Combo</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search combos..."
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Combo Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Regular Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Combo Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Savings</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCombos.length > 0 ? (
              filteredCombos.map(combo => {
                const regularPrice = combo.regular_price || 0;
                const comboPrice = combo.combo_price || 0;
                const savings = regularPrice - comboPrice;
                const savingsPercent = regularPrice > 0 ? Math.round((savings / regularPrice) * 100) : 0;

                return (
                  <tr key={combo._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{combo.name || 'Combo'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {combo.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">₹{regularPrice}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{comboPrice}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ₹{savings} ({savingsPercent}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(combo._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No combos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
