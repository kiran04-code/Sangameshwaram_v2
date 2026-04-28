import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Upload, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

export const MenuManagement = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    name_hi: '',
    name_mr: '',
    image_url: '',
    description: '',
    display_order: 0,
    active: true
  });

  const [productForm, setProductForm] = useState({
    name: '',
    name_hi: '',
    name_mr: '',
    category_id: '',
    price: 0,
    description: '',
    image_url: '',
    is_veg: true,
    active: true
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/admin/menu-items`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (file, formType) => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = `${BACKEND_URL}${response.data.url}`;
      if (formType === 'category') {
        setCategoryForm({ ...categoryForm, image_url: imageUrl });
      } else {
        setProductForm({ ...productForm, image_url: imageUrl });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        // Update existing category
        await axios.put(
          `${API}/admin/categories/${editingCategory._id}`,
          categoryForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new category
        await axios.post(
          `${API}/admin/categories`,
          categoryForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowCategoryModal(false);
      setCategoryForm({
        name: '',
        name_hi: '',
        name_mr: '',
        image_url: '',
        description: '',
        display_order: 0,
        active: true
      });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        await axios.put(
          `${API}/admin/menu-items/${editingProduct._id}`,
          productForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new product
        await axios.post(
          `${API}/admin/menu-items`,
          productForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowProductModal(false);
      setProductForm({
        name: '',
        name_hi: '',
        name_mr: '',
        category_id: '',
        price: 0,
        description: '',
        image_url: '',
        is_veg: true,
        active: true
      });
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(
        `${API}/admin/categories/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(
        `${API}/admin/menu-items/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const editCategory = (category) => {
    setCategoryForm(category);
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const editProduct = (product) => {
    setProductForm(product);
    setEditingProduct(product);
    setShowProductModal(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading menu...</div>;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-3 font-semibold text-sm transition-all ${
            activeTab === 'categories'
              ? 'border-b-2 border-[#8B1538] text-[#8B1538]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 font-semibold text-sm transition-all ${
            activeTab === 'products'
              ? 'border-b-2 border-[#8B1538] text-[#8B1538]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Products
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#8B1538]">Menu Categories</h3>
            <button
              onClick={() => {
                setCategoryForm({
                  name: '',
                  name_hi: '',
                  name_mr: '',
                  image_url: '',
                  description: '',
                  display_order: 0,
                  active: true
                });
                setEditingCategory(null);
                setShowCategoryModal(true);
              }}
              className="btn-gold flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category._id} className="premium-card p-4 relative">
                {category.image_url && (
                  <div className="w-full h-40 mb-3 rounded-lg overflow-hidden">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h4 className="font-bold text-lg text-[#8B1538] mb-1">{category.name}</h4>
                {category.name_hi && (
                  <p className="text-sm text-gray-600 mb-1">{category.name_hi}</p>
                )}
                {category.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{category.description}</p>
                )}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => editCategory(category)}
                    className="flex-1 text-blue-600 font-semibold text-sm hover:bg-blue-50 py-2 rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="flex-1 text-red-600 font-semibold text-sm hover:bg-red-50 py-2 rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
                <span
                  className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold ${
                    category.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {category.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No categories yet. Create your first category!
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#8B1538]">Menu Items</h3>
            <button
              onClick={() => {
                setProductForm({
                  name: '',
                  name_hi: '',
                  name_mr: '',
                  category_id: '',
                  price: 0,
                  description: '',
                  image_url: '',
                  is_veg: true,
                  active: true
                });
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="btn-gold flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* Group products by category */}
          {categories.map(category => {
            const categoryProducts = products.filter(p => p.category_id === category._id);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category._id} className="mb-8">
                <h4 className="font-bold text-base text-[#2D1B1E] mb-4">{category.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categoryProducts.map(product => (
                    <div key={product._id} className="premium-card p-3 relative">
                      {product.image_url && (
                        <div className="w-full h-32 mb-2 rounded-lg overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-sm text-[#8B1538] flex-1">{product.name}</h5>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                            product.is_veg
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.is_veg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-[#FFD700] mb-2">₹{product.price}</p>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="flex-1 text-blue-600 font-semibold text-xs hover:bg-blue-50 py-1.5 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 text-red-600 font-semibold text-xs hover:bg-red-50 py-1.5 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products yet. Create your first product!
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          form={categoryForm}
          setForm={setCategoryForm}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onUploadImage={handleUploadImage}
          uploading={uploading}
          isEditing={!!editingCategory}
        />
      )}

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          form={productForm}
          setForm={setProductForm}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onUploadImage={handleUploadImage}
          uploading={uploading}
          isEditing={!!editingProduct}
        />
      )}
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({
  form,
  setForm,
  onSave,
  onClose,
  onUploadImage,
  uploading,
  isEditing
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#8B1538]">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Category Image</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B1538] transition-all">
                  <Upload size={18} />
                  <span className="text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onUploadImage(e.target.files[0], 'category')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
              </div>
              {form.image_url && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#FFD700] flex-shrink-0">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name (English) */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Category Name (English)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Appetizers"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              required
            />
          </div>

          {/* Name (Hindi) */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Category Name (Hindi)</label>
            <input
              type="text"
              value={form.name_hi}
              onChange={(e) => setForm({ ...form, name_hi: e.target.value })}
              placeholder="e.g., स्टार्टर"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
            />
          </div>

          {/* Name (Marathi) */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Category Name (Marathi)</label>
            <input
              type="text"
              value={form.name_mr}
              onChange={(e) => setForm({ ...form, name_mr: e.target.value })}
              placeholder="e.g., अपेटाइजर"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Category description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              rows="3"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 cursor-pointer"
            />
            <label className="font-semibold text-sm">Active Category</label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 btn-gold rounded-lg font-semibold text-sm transition-all"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Modal Component
const ProductModal = ({
  form,
  setForm,
  categories,
  onSave,
  onClose,
  onUploadImage,
  uploading,
  isEditing
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#8B1538]">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Product Image</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B1538] transition-all">
                  <Upload size={18} />
                  <span className="text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onUploadImage(e.target.files[0], 'product')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
              </div>
              {form.image_url && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#FFD700] flex-shrink-0">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name (English) */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Product Name (English)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Paneer Tikka"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              required
            />
          </div>

          {/* Name (Hindi) */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Product Name (Hindi)</label>
            <input
              type="text"
              value={form.name_hi}
              onChange={(e) => setForm({ ...form, name_hi: e.target.value })}
              placeholder="e.g., पनीर टिक्का"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
            />
          </div>

          {/* Name (Marathi) */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Product Name (Marathi)</label>
            <input
              type="text"
              value={form.name_mr}
              onChange={(e) => setForm({ ...form, name_mr: e.target.value })}
              placeholder="e.g., पनीर टिक्का"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              placeholder="e.g., 250"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              step="0.01"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Type</label>
            <select
              value={form.is_veg}
              onChange={(e) => setForm({ ...form, is_veg: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
            >
              <option value="true">Vegetarian</option>
              <option value="false">Non-Vegetarian</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              rows="3"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 cursor-pointer"
            />
            <label className="font-semibold text-sm">Active Product</label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 btn-gold rounded-lg font-semibold text-sm transition-all"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
