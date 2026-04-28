import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Package, Trash2, Grid, List, Plus, X, Upload, Clock, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png';

const InventoryManagement = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, logout } = useAdmin();
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [editingId, setEditingId] = useState(null);
  const [showStockLogs, setShowStockLogs] = useState(false);
  const [selectedItemForLogs, setSelectedItemForLogs] = useState(null);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [addStockData, setAddStockData] = useState({
    quantity: 0,
    price_per_unit: 0
  });
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: 0,
    unit: 'kg',
    min_stock: 0,
    supplier: '',
    category: '',
    price_per_unit: 0,
    image: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data.data || response.data || []);
      
      // Extract unique categories from inventory items
      const uniqueCategories = [...new Set(
        (response.data.data || response.data || [])
          .map(item => item.category)
          .filter(Boolean)
      )];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('item_name', formData.item_name);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('min_stock', formData.min_stock);
      formDataToSend.append('supplier', formData.supplier);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price_per_unit', formData.price_per_unit);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingId) {
        // Update existing item
        await axios.put(`${API}/inventory/${editingId}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new item
        await axios.post(`${API}/inventory`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setFormData({ item_name: '', quantity: 0, unit: 'kg', min_stock: 0, supplier: '', category: '', price_per_unit: 0, image: null });
      setImagePreview(null);
      setShowForm(false);
      setEditingId(null);
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Failed to save inventory item: ' + error.response?.data?.detail || error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingId(item._id);
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity,
      unit: item.unit,
      min_stock: item.min_stock,
      supplier: item.supplier || '',
      category: item.category || '',
      price_per_unit: item.price_per_unit || 0,
      image: null
    });
    if (item.image_url) {
      setImagePreview(`${BACKEND_URL}/api/admin/uploads/${item.image_url.split('/').pop()}`);
    }
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ item_name: '', quantity: 0, unit: 'kg', min_stock: 0, supplier: '', category: '', price_per_unit: 0, image: null });
    setImagePreview(null);
    setShowForm(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API}/inventory/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('Failed to delete inventory item');
    }
  };

  const handleAddStock = async (item) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('add_quantity', addStockData.quantity);
      formDataToSend.append('new_price_per_unit', addStockData.price_per_unit);
      
      await axios.post(`${API}/inventory/${item._id}/add-stock`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAddStockData({ quantity: 0, price_per_unit: 0 });
      setShowAddStockForm(false);
      setSelectedItemForLogs(null);
      fetchInventory();
      alert('Stock added successfully!');
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock: ' + error.response?.data?.detail || error.message);
    }
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= minStock) {
      return { label: 'Low Stock', color: 'bg-red-100 text-red-800', badgeColor: 'bg-red-500' };
    } else if (quantity <= minStock * 1.5) {
      return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', badgeColor: 'bg-yellow-500' };
    } else {
      return { label: 'Good', color: 'bg-green-100 text-green-800', badgeColor: 'bg-green-500' };
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.item_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate summary statistics
  const totalInventoryValue = inventory.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price_per_unit || 0)), 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.min_stock);
  const allStockLogs = inventory
    .flatMap(item => 
      (item.stock_logs || []).map(log => ({
        ...log,
        itemName: item.item_name,
        unit: item.unit,
        itemId: item._id
      }))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5); // Last 5 updates

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFAF0 100%)' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B1538] to-[#A0153E] border-b-4 border-[#FFD700] px-3 sm:px-4 py-3 sm:py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src={LOGO_URL} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#FFD700] flex-shrink-0" />
            <h1 className="text-sm sm:text-lg md:text-2xl font-black text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>Inventory Management</h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-gold flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
          >
            <LogOut size={16} className="sm:size-18" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
          <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#8B1538' }}>Inventory Management</h2>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ item_name: '', quantity: 0, unit: 'kg', min_stock: 0, supplier: '', category: '', price_per_unit: 0, image: null });
                setImagePreview(null);
              }}
              className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#A0153E] transition-all text-sm font-semibold"
            >
              + Add Item
            </button>
          )}
        </div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Total Inventory Value Card */}
          <div className="premium-card p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Total Inventory Value</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">₹ {totalInventoryValue.toFixed(2)}</h3>
              </div>
              <div className="text-3xl sm:text-4xl text-green-300">📦</div>
            </div>
            <p className="text-xs text-green-600 mt-3">
              <span className="font-semibold">{inventory.length}</span> items in stock
            </p>
          </div>

          {/* Low Stock Alert Card */}
          <div className="premium-card p-4 sm:p-6 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Low Stock Items</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">{lowStockItems.length}</h3>
              </div>
              <div className="text-3xl sm:text-4xl">⚠️</div>
            </div>
            {lowStockItems.length > 0 ? (
              <div className="mt-3 space-y-1 max-h-20 overflow-y-auto">
                {lowStockItems.map(item => (
                  <p key={item._id} className="text-xs text-red-700 font-semibold truncate">
                    • {item.item_name} ({item.quantity}/{item.min_stock} {item.unit})
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-green-600 mt-3 font-semibold">✓ All items at safe levels</p>
            )}
          </div>

          {/* Recent Updates Card */}
          <div className="premium-card p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Recent Stock Updates</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">{allStockLogs.length}</h3>
              </div>
              <div className="text-3xl sm:text-4xl">📊</div>
            </div>
            {allStockLogs.length > 0 ? (
              <div className="mt-3 space-y-1 max-h-20 overflow-y-auto">
                {allStockLogs.map((log, idx) => (
                  <p key={idx} className="text-xs text-blue-700 font-semibold truncate">
                    • {log.itemName}: +{log.added_quantity} @ ₹{log.price_per_unit?.toFixed(2) || 'N/A'}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-3 font-semibold">No updates yet</p>
            )}
          </div>
        </div>

        {showForm && (
          <div className="premium-card p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#8B1538' }}>
              {editingId ? 'Edit Inventory Item' : 'Add Inventory Item'}
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8B1538] transition-colors">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 mx-auto object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                      className="text-sm text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm font-semibold text-[#8B1538]">Click to upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                />
                <div className="flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewCategory(true);
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__">+ Create New Category</option>
                  </select>
                  {showNewCategory && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            setFormData({ ...formData, category: newCategoryName });
                            setCategories([...categories, newCategoryName]);
                            setNewCategoryName('');
                            setShowNewCategory(false);
                          }
                        }}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName('');
                        }}
                        className="px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Quantity"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                >
                  <option value="kg">KG</option>
                  <option value="liter">Liter</option>
                  <option value="pcs">Pcs</option>
                  <option value="box">Box</option>
                </select>
                <input
                  type="number"
                  placeholder="Min Stock Level"
                  step="0.01"
                  value={formData.min_stock}
                  onChange={(e) => setFormData({ ...formData, min_stock: parseFloat(e.target.value) || 0 })}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                />
                <input
                  type="number"
                  placeholder="Price per Unit (₹)"
                  step="0.01"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData({ ...formData, price_per_unit: parseFloat(e.target.value) || 0 })}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-all"
              >
                {uploading ? 'Saving Item...' : (editingId ? 'Update Item' : 'Add Item')}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-all mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
          />
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterCategory === 'all'
                  ? 'bg-[#8B1538] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-[#8B1538] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              viewMode === 'cards'
                ? 'bg-[#8B1538] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Grid size={18} />
            Cards
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-[#8B1538] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List size={18} />
            List
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading inventory...</div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No inventory items found</div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item.quantity, item.min_stock);
              return (
                <div key={item._id} className="premium-card overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image Section */}
                  <div className="relative h-24 sm:h-28 bg-gray-100 overflow-hidden group">
                    {item.image_url ? (
                      <img
                        src={`${BACKEND_URL}/api/admin/uploads/${item.image_url.split('/').pop()}`}
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <Package size={32} className="text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-xs font-bold text-white ${status.badgeColor}`}>
                      {status.label}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="absolute top-1.5 left-1.5 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Delete item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[#8B1538] mb-1 truncate">{item.item_name}</h3>
                    
                    <div className="space-y-0.5 text-xs mb-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Qty:</span>
                        <span className="font-semibold text-[#8B1538]">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min:</span>
                        <span className="font-semibold text-gray-700">{item.min_stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-[#FFD700]">₹ {(item.price_per_unit || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-bold text-green-600">₹ {((item.quantity || 0) * (item.price_per_unit || 0)).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${status.badgeColor}`}
                          style={{ width: `${Math.min((item.quantity / item.min_stock) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className={`text-xs font-semibold mt-0.5 ${status.color} px-1.5 py-0.5 rounded`}>
                        {status.label}
                      </p>
                    </div>

                    {/* Update Button */}
                    <div className="flex gap-1.5">
                      <button
                        className="flex-1 bg-[#8B1538] hover:bg-[#A0153E] text-white font-semibold py-1 rounded text-xs transition-all"
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded text-xs transition-all flex items-center justify-center gap-1"
                        onClick={() => {
                          setSelectedItemForLogs(item);
                          setShowStockLogs(true);
                        }}
                        title="Add stock"
                      >
                        <Plus size={14} />
                        Stock
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item.quantity, item.min_stock);
              return (
                <div key={item._id} className="premium-card overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Horizontal Layout - Image Left, Info Right */}
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section - Left */}
                    <div className="relative w-full sm:w-32 h-28 sm:h-auto bg-gray-100 overflow-hidden group flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={`${BACKEND_URL}/api/admin/uploads/${item.image_url.split('/').pop()}`}
                          alt={item.item_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Package size={32} className="text-gray-400" />
                        </div>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Content Section - Right */}
                    <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-[#8B1538] truncate">{item.item_name}</h3>
                            <p className="text-xs text-gray-500 truncate">{item.supplier || 'No supplier'}</p>
                          </div>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0 whitespace-nowrap ${status.badgeColor}`}>
                            {status.label}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1.5 mb-2 text-xs">
                          <div className="bg-gray-50 p-1.5 rounded">
                            <p className="text-xs text-gray-600">Qty</p>
                            <p className="font-bold text-[#8B1538] truncate">{item.quantity} {item.unit}</p>
                          </div>
                          <div className="bg-gray-50 p-1.5 rounded">
                            <p className="text-xs text-gray-600">Min</p>
                            <p className="font-bold text-gray-700">{item.min_stock}</p>
                          </div>
                          <div className="bg-gray-50 p-1.5 rounded">
                            <p className="text-xs text-gray-600">%</p>
                            <p className="font-bold text-[#8B1538]">{item.min_stock > 0 ? ((item.quantity / item.min_stock) * 100).toFixed(0) : 0}%</p>
                          </div>
                        </div>

                        {/* Stock Value Section */}
                        <div className="grid grid-cols-2 gap-1.5 mb-2 text-xs">
                          <div className="bg-blue-50 p-1.5 rounded border border-blue-200">
                            <p className="text-xs text-gray-600">Price/Unit</p>
                            <p className="font-bold text-blue-600">₹ {(item.price_per_unit || 0).toFixed(2)}</p>
                          </div>
                          <div className="bg-green-50 p-1.5 rounded border border-green-200">
                            <p className="text-xs text-gray-600">Stock Value</p>
                            <p className="font-bold text-green-600">₹ {((item.quantity || 0) * (item.price_per_unit || 0)).toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Status Bar Below */}
                        <div className="mb-1.5">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all ${status.badgeColor}`}
                              style={{ width: `${Math.min((item.quantity / item.min_stock) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className={`text-xs font-semibold mt-0.5 ${status.color} px-2 py-0.5 rounded inline-block`}>
                            {status.label}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 pt-1.5 border-t">
                        <button
                          className="flex-1 bg-[#8B1538] hover:bg-[#A0153E] text-white font-semibold py-1 rounded text-xs transition-all"
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded text-xs transition-all flex items-center justify-center gap-1"
                          onClick={() => {
                            setSelectedItemForLogs(item);
                            setShowStockLogs(true);
                          }}
                          title="Add stock"
                        >
                          <Plus size={14} />
                          Stock
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded text-xs transition-all"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stock Logs Sidebar */}
        {showStockLogs && selectedItemForLogs && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
            {/* Overlay */}
            <div className="flex-1" onClick={() => {
              setShowStockLogs(false);
              setSelectedItemForLogs(null);
              setShowAddStockForm(false);
              setAddStockData({ quantity: 0, price_per_unit: 0 });
            }}></div>

            {/* Right Sidebar */}
            <div className="w-96 bg-white shadow-2xl overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#8B1538] to-[#A0153E] text-white p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{selectedItemForLogs.item_name}</h3>
                  <p className="text-xs text-gray-200">Stock & Pricing History</p>
                </div>
                <button
                  onClick={() => {
                    setShowStockLogs(false);
                    setSelectedItemForLogs(null);
                    setShowAddStockForm(false);
                    setAddStockData({ quantity: 0, price_per_unit: 0 });
                  }}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Current Stock Info */}
              <div className="p-4 bg-gradient-to-b from-blue-50 to-green-50 border-b-2 border-gray-200">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
                    <p className="text-xs text-gray-600">Current Qty</p>
                    <p className="font-bold text-lg text-blue-600">{selectedItemForLogs.quantity} {selectedItemForLogs.unit}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-green-200">
                    <p className="text-xs text-gray-600">Current Value</p>
                    <p className="font-bold text-lg text-green-600">₹ {((selectedItemForLogs.quantity || 0) * (selectedItemForLogs.price_per_unit || 0)).toFixed(2)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Price/Unit</p>
                    <p className="font-bold text-[#FFD700]">₹ {(selectedItemForLogs.price_per_unit || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Status</p>
                    <p className={`font-bold text-sm ${
                      selectedItemForLogs.quantity <= selectedItemForLogs.min_stock ? 'text-red-600' :
                      selectedItemForLogs.quantity <= selectedItemForLogs.min_stock * 1.5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {selectedItemForLogs.quantity <= selectedItemForLogs.min_stock ? 'Low' :
                       selectedItemForLogs.quantity <= selectedItemForLogs.min_stock * 1.5 ? 'Medium' : 'Good'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Stock Form */}
              {!showAddStockForm ? (
                <div className="p-4">
                  <button
                    onClick={() => setShowAddStockForm(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus size={20} />
                    Add Stock
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border-b-2 border-green-200">
                  <h4 className="font-bold text-sm mb-3 text-green-700">Add New Stock</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Quantity to Add</label>
                      <input
                        type="number"
                        step="0.01"
                        value={addStockData.quantity}
                        onChange={(e) => setAddStockData({ ...addStockData, quantity: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 5"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">New Price per Unit (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={addStockData.price_per_unit}
                        onChange={(e) => setAddStockData({ ...addStockData, price_per_unit: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 15.50"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 mt-1"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 mb-2">💰 Value Breakdown</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Stock ({selectedItemForLogs.quantity} {selectedItemForLogs.unit}):</span>
                          <span className="font-bold text-blue-600">₹ {(selectedItemForLogs.quantity * selectedItemForLogs.price_per_unit).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">New Stock ({addStockData.quantity} {selectedItemForLogs.unit}):</span>
                          <span className="font-bold text-green-600">₹ {(addStockData.quantity * addStockData.price_per_unit).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between">
                          <span className="text-gray-800 font-semibold">Total Stock Value:</span>
                          <span className="font-bold text-lg text-green-600">₹ {((selectedItemForLogs.quantity * selectedItemForLogs.price_per_unit) + (addStockData.quantity * addStockData.price_per_unit)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddStock(selectedItemForLogs)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all"
                      >
                        Save Stock
                      </button>
                      <button
                        onClick={() => {
                          setShowAddStockForm(false);
                          setAddStockData({ quantity: 0, price_per_unit: 0 });
                        }}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Logs History */}
              <div className="p-4">
                <h4 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2">
                  <Clock size={16} />
                  Stock Update History
                </h4>
                {selectedItemForLogs.stock_logs && selectedItemForLogs.stock_logs.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedItemForLogs.stock_logs.map((log, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border-l-4 border-[#8B1538]">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-sm text-[#8B1538]">+{log.added_quantity} {selectedItemForLogs.unit}</p>
                            <p className="text-xs text-gray-600">@ ₹ {log.price_per_unit.toFixed(2)}/unit</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹ {(log.added_quantity * log.price_per_unit).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded mb-2 border border-blue-200">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Stock after:</span>
                            <span className="font-bold text-[#8B1538]">{log.quantity_after} {selectedItemForLogs.unit}</span>
                          </div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Total Stock Value:</span>
                            <span className="font-bold text-green-600">₹ {log.total_stock_value?.toFixed(2) || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Avg Price/Unit:</span>
                            <span className="font-bold text-blue-600">₹ {log.weighted_avg_price?.toFixed(2) || 'N/A'}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No stock updates yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Universal Stock Logs - All Updates */}
        <div className="mt-12 mb-8">
          <div className="premium-card p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#8B1538] flex items-center gap-2">
              <Clock size={24} />
              Universal Stock Update Logs
            </h3>
            
            {/* All Logs Combined */}
            {inventory && inventory.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {
                  // Flatten all stock logs from all items with item reference
                  inventory
                    .flatMap(item => 
                      (item.stock_logs || []).map(log => ({
                        ...log,
                        itemName: item.item_name,
                        unit: item.unit,
                        itemId: item._id
                      }))
                    )
                    // Sort by timestamp descending (newest first)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((log, idx) => (
                      <div key={`${log.itemId}-${idx}`} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg border-l-4 border-[#8B1538] hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div>
                            <p className="font-bold text-sm sm:text-base text-[#8B1538]">{log.itemName}</p>
                            <p className="text-xs text-gray-600">+{log.added_quantity} {log.unit} @ ₹ {log.price_per_unit?.toFixed(2) || 'N/A'}/unit</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹ {(log.batch_value || log.added_quantity * log.price_per_unit)?.toFixed(2) || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {/* Detailed Breakdown */}
                        <div className="bg-white p-2 sm:p-3 rounded border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <p className="text-gray-600 font-semibold">Qty Added</p>
                            <p className="font-bold text-[#8B1538]">{log.added_quantity} {log.unit}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-semibold">Stock After</p>
                            <p className="font-bold text-blue-600">{log.quantity_after} {log.unit}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-semibold">Total Value</p>
                            <p className="font-bold text-green-600">₹ {log.total_stock_value?.toFixed(2) || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-semibold">Avg Price/Unit</p>
                            <p className="font-bold text-purple-600">₹ {log.weighted_avg_price?.toFixed(2) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                }
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Clock size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No stock updates recorded yet</p>
                <p className="text-xs text-gray-400 mt-1">All inventory stock updates will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
