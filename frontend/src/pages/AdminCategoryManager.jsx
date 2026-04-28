import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Menu } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

// Helper function to normalize image URLs
const normalizeImageUrl = (url) => {
  if (!url) return null;
  
  // If it's a blob URL (for previews), return as is
  if (url.startsWith('blob:')) return url;
  
  // If URL already has http, return as is
  if (url.startsWith('http')) return url;
  
  // If URL already starts with /api/uploads, prepend backend URL
  if (url.startsWith('/api/uploads')) return `${BACKEND_URL}${url}`;
  
  // If URL starts with /uploads (old format), prepend /api and backend URL
  if (url.startsWith('/uploads')) return `${BACKEND_URL}/api${url}`;
  
  // If URL is just a filename (no path), add full path with backend URL
  if (!url.includes('/')) return `${BACKEND_URL}/api/uploads/${url}`;
  
  // Otherwise prepend /api and backend URL
  return `${BACKEND_URL}/api${url}`;
};

const AdminCategoryManager = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [frequentItems, setFrequentItems] = useState([]);
  const [quickAddItems, setQuickAddItems] = useState({});
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingFrequentItem, setEditingFrequentItem] = useState(null);
  const [frequentItemForm, setFrequentItemForm] = useState({
    delivery_time: '',
    discount: '',
    rating: ''
  });

  // Quick Add options (same items used in BottomNavigation)
  const defaultQuickAddOptions = [
    { _id: 'water-bottle', id: 'water-bottle', name: 'Mineral Water', description: '500ml Chilled Bottle', price: 30, category: 'BEVERAGES', is_veg: true },
    { _id: 'tea', id: 'tea', name: 'Chai (Tea)', description: 'Hot Indian Tea', price: 40, category: 'BEVERAGES', is_veg: true },
    { _id: 'coffee', id: 'coffee', name: 'Coffee', description: 'Hot Brewed Coffee', price: 50, category: 'BEVERAGES', is_veg: true },
    { _id: 'vada-pav', id: 'vada-pav', name: 'Vada Pav', description: 'Crispy Potato Fritter', price: 25, category: 'SNACKS', is_veg: true }
  ];

  const [quickAddOptions, setQuickAddOptions] = useState(defaultQuickAddOptions);
  const [selectedQuickAdd, setSelectedQuickAdd] = useState({});

  // View mode states
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image_url: null,
    display_order: 0,
    active: true
  });

  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    image_url: null,
    is_veg: true,
    active: true,
    raw_materials: [] // New field for recipe/raw materials
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    fetchData();
    fetchFrequentItems();
    fetchQuickAddItems();
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(`${API}/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryItems(response.data.data || response.data || []);
      console.log('✅ Loaded inventory items:', response.data.data?.length || response.data?.length || 0);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setInventoryItems([]);
    }
  };

  const fetchQuickAddItems = async () => {
    try {
      const response = await axios.get(`${API}/quick-add-items`);
      if (response.data && response.data.length > 0) {
        setQuickAddOptions(response.data);
        console.log('✅ Loaded quick add items from backend:', response.data);
      }
    } catch (err) {
      console.log('Quick add items not found, using defaults:', err.message);
      // Silently fail - use default options
    }
  };

  const saveQuickAddItems = async (items) => {
    try {
      // Clean items to ensure they match the Pydantic model
      const cleanedItems = items.map((item, idx) => {
        const cleaned = {
          _id: item._id ? String(item._id).trim() : `item-${idx}`,
          id: item.id ? String(item.id).trim() : String(item._id).trim(),
          name: String(item.name || '').trim(),
          category: String(item.category || '').trim(),
          price: parseFloat(item.price) || 0,
          image_url: item.image_url ? String(item.image_url).trim() : null,
          description: item.description ? String(item.description).trim() : null,
          is_veg: Boolean(item.is_veg !== false)
        };
        
        // Validate required fields
        if (!cleaned.name) throw new Error(`Item ${idx}: name is required`);
        if (!cleaned.category) throw new Error(`Item ${idx}: category is required`);
        if (cleaned.price === 0 || !cleaned.price) throw new Error(`Item ${idx}: price must be a valid number`);
        
        return cleaned;
      });
      
      console.log('✅ Saving cleaned quick add items:', JSON.stringify(cleanedItems, null, 2));
      const response = await axios.post(`${API}/quick-add-items`, cleanedItems);
      console.log('✅ Quick add items saved to backend:', response.data);
    } catch (err) {
      console.error('❌ Error saving quick add items:', err.message);
      console.error('❌ Error details:', err.response?.data);
      alert(`Failed to save quick add items: ${err.message || err.response?.data?.detail || err.message}`);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API}/categories?limit=100`),
        axios.get(`${API}/menu-items?limit=1000`)
      ]);
      console.log('✅ Fetched categories:', catRes.data?.length || 0, 'items');
      console.log('✅ Fetched products:', prodRes.data?.length || 0, 'items');
      
      // Ensure raw_materials is always an array for each product
      const productsWithMaterials = (prodRes.data || []).map(product => ({
        ...product,
        raw_materials: Array.isArray(product.raw_materials) ? product.raw_materials : []
      }));
      
      console.log('📋 First product raw_materials:', productsWithMaterials[0]?.raw_materials);
      
      // Debug: Find and log Samosa
      const samosa = productsWithMaterials.find(p => p.name === 'Samosa');
      if (samosa) {
        console.log('🥟 Samosa found!');
        console.log('   raw_materials:', samosa.raw_materials);
        console.log('   is array?:', Array.isArray(samosa.raw_materials));
        console.log('   length:', samosa.raw_materials?.length);
      }
      
      setCategories(catRes.data || []);
      setProducts(productsWithMaterials);
    } catch (err) {
      console.error('Error fetching data:', err);
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFrequentItems = async () => {
    try {
      const response = await axios.get(`${API}/frequent-items`);
      setFrequentItems(response.data || []);
      console.log('✅ Loaded frequent items from backend:', response.data);
    } catch (err) {
      console.error('Error fetching frequent items:', err);
      // Silently fail - start with empty list
    }
  };

  // CATEGORY HANDLERS
  const handleCategoryImageChange = async (e, categoryId = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Build query string with category_id if uploading from list
      const params = new URLSearchParams();
      if (categoryId) {
        params.append('category_id', categoryId);
      }
      
      const response = await axios.post(
        `${API}/upload/category-image${params.toString() ? '?' + params.toString() : ''}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      const imageUrl = response.data.image_url;
      
      // If updating from category list (not modal), update local state
      if (categoryId) {
        setCategories(categories.map(cat => 
          cat._id === categoryId 
            ? { ...cat, image_url: imageUrl }
            : cat
        ));
        alert('✓ Category image updated successfully!');
      } else {
        // If updating from modal, update form state
        setCategoryForm({ ...categoryForm, image_url: imageUrl });
      }
    } catch (err) {
      console.error('Error uploading category image:', err.response?.data || err.message);
      alert(`Failed to upload image: ${err.response?.data?.detail || err.message}`);
      setImagePreview(null);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        console.log('🔄 Updating category:', editingCategory._id);
        await axios.put(`${API}/categories/${editingCategory._id}`, categoryForm);
      } else {
        console.log('✨ Creating new category:', categoryForm.name);
        await axios.post(`${API}/categories`, categoryForm);
      }
      console.log('✅ Category saved! Refreshing data...');
      closeCategoryModal();
      await fetchData();
      console.log('✅ Data refreshed! Categories count:', categories.length);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category');
    }
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url,
      display_order: category.display_order || 0,
      active: category.active !== false
    });
    setImagePreview(category.image_url);
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`${API}/categories/${categoryId}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to delete category');
      }
    }
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      image_url: null,
      display_order: 0,
      active: true
    });
    setImagePreview(null);
  };

  // PRODUCT HANDLERS
  const handleProductImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setProductImagePreview(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // If editing an existing product, pass item_id to update DB
      const params = new URLSearchParams();
      if (editingProduct?._id) {
        params.append('item_id', editingProduct._id);
      }
      
      const response = await axios.post(
        `${API}/upload/menu-item-image${params.toString() ? '?' + params.toString() : ''}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setProductForm({ ...productForm, image_url: response.data.image_url });
    } catch (err) {
      console.error('Error uploading product image:', err);
      alert(`Failed to upload product image: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.category_id || !productForm.price) {
      alert('Please fill all required fields');
      return;
    }

    // Find the category name from category_id (UUID)
    const selectedCategory = categories.find(cat => (cat._id || cat.id) === productForm.category_id);
    if (!selectedCategory) {
      alert('Selected category not found');
      return;
    }

    // Prepare data for backend - send 'category' as the category name string
    const dataToSend = {
      ...productForm,
      category: selectedCategory.name,  // ← Backend expects 'category' as category name
      price: parseFloat(productForm.price)  // Ensure price is a number
    };
    delete dataToSend.category_id;  // Remove category_id field

    console.log('📝 Sending product data to backend:', dataToSend);
    console.log('✅ Category selected:', selectedCategory.name);

    try {
      if (editingProduct) {
        console.log('🔄 Updating product...');
        await axios.put(`${API}/menu-items/${editingProduct._id}`, dataToSend);
      } else {
        console.log('✨ Creating new product...');
        await axios.post(`${API}/menu-items`, dataToSend);
      }
      console.log('✅ Product saved successfully!');
      closeProductModal();
      fetchData();
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    const catId = product.category_id || product.category;
    const rawMaterials = Array.isArray(product.raw_materials) ? product.raw_materials : [];
    
    console.log('🔧 Editing product:', product.name);
    console.log('   Product object:', product);
    console.log('   raw_materials from product:', product.raw_materials);
    console.log('   raw_materials after processing:', rawMaterials);
    console.log('   is array?:', Array.isArray(rawMaterials));
    console.log('   length:', rawMaterials.length);
    
    const formState = {
      name: product.name,
      category_id: catId,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url,
      is_veg: product.is_veg !== false,
      active: product.active !== false,
      raw_materials: rawMaterials
    };
    
    console.log('📝 Setting form state:', formState);
    
    setProductForm(formState);
    setProductImagePreview(product.image_url);
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`${API}/menu-items/${productId}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      category_id: '',
      price: '',
      description: '',
      image_url: null,
      is_veg: true,
      active: true,
      raw_materials: []
    });
    setProductImagePreview(null);
  };

  // Calculate making cost based on raw materials
  const calculateMakingCost = () => {
    return productForm.raw_materials.reduce((total, material) => {
      const inventoryItem = inventoryItems.find(item => item._id === material.inventory_id);
      if (inventoryItem) {
        const cost = (inventoryItem.price_per_unit || 0) * (material.quantity || 0);
        return total + cost;
      }
      return total;
    }, 0);
  };

  // Add raw material to the recipe
  const addRawMaterial = () => {
    setProductForm({
      ...productForm,
      raw_materials: [
        ...productForm.raw_materials,
        { inventory_id: '', quantity: 0 }
      ]
    });
  };

  // Remove raw material from the recipe
  const removeRawMaterial = (index) => {
    setProductForm({
      ...productForm,
      raw_materials: productForm.raw_materials.filter((_, i) => i !== index)
    });
  };

  // Update raw material
  const updateRawMaterial = (index, field, value) => {
    const updated = [...productForm.raw_materials];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setProductForm({
      ...productForm,
      raw_materials: updated
    });
  };

  const openProductModal = (categoryId = '') => {
    setProductForm(prev => ({ ...prev, category_id: categoryId }));
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const getCategoryProducts = (categoryId, categoryName) => {
    // Match by category name since products have category field as string
    return products.filter(p => p.category === categoryName);
  };

  const getFilteredProducts = (categoryProducts) => {
    if (!searchQuery.trim()) return categoryProducts;
    return categoryProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const addToFrequent = async (product) => {
    const exists = frequentItems.find(item => item._id === product._id);
    if (!exists) {
      const newFrequentItems = [...frequentItems, { 
        ...product, 
        quantity: 0,
        delivery_time: '15 mins',
        discount: 0,
        rating: 4.5
      }];
      setFrequentItems(newFrequentItems);
      
      // Save to backend with cleaned data
      try {
        const cleanedItems = newFrequentItems.map((item, idx) => {
          const cleaned = {
            _id: String(item._id || `item-${idx}`).trim(),
            name: String(item.name || '').trim(),
            category: String(item.category || '').trim(),
            price: parseFloat(item.price) || 0,
            image_url: item.image_url ? String(item.image_url).trim() : null,
            description: item.description ? String(item.description).trim() : null,
            is_veg: Boolean(item.is_veg !== false),
            delivery_time: String(item.delivery_time || '15 mins').trim(),
            discount: parseFloat(item.discount) || 0,
            rating: parseFloat(item.rating) || 4.5
          };
          
          // Validate required fields
          if (!cleaned.name) throw new Error(`Item ${idx}: name is required`);
          if (!cleaned.category) throw new Error(`Item ${idx}: category is required`);
          if (cleaned.price === 0 || !cleaned.price) throw new Error(`Item ${idx}: price must be a valid number`);
          
          return cleaned;
        });
        
        console.log('✅ Sending cleaned frequent items:', JSON.stringify(cleanedItems, null, 2));
        const response = await axios.post(`${API}/frequent-items`, cleanedItems);
        console.log('✅ Added item to frequent list on backend:', response.data);
        alert('✓ Item added to Frequently Accessed!');
      } catch (err) {
        console.error('❌ Error saving to backend:', err.message);
        console.error('❌ Error details:', err.response?.data);
        alert(`Failed to save: ${err.message || err.response?.data?.detail || err.message}`);
        // Revert state on error
        setFrequentItems(frequentItems);
      }
    }
  };

  const removeFromFrequent = async (productId) => {
    const updatedItems = frequentItems.filter(item => item._id !== productId);
    setFrequentItems(updatedItems);
    
    // Save to backend with cleaned data
    try {
      const cleanedItems = updatedItems.map((item, idx) => {
        const cleaned = {
          _id: String(item._id || `item-${idx}`).trim(),
          name: String(item.name || '').trim(),
          category: String(item.category || '').trim(),
          price: parseFloat(item.price) || 0,
          image_url: item.image_url ? String(item.image_url).trim() : null,
          description: item.description ? String(item.description).trim() : null,
          is_veg: Boolean(item.is_veg !== false),
          delivery_time: String(item.delivery_time || '15 mins').trim(),
          discount: parseFloat(item.discount) || 0,
          rating: parseFloat(item.rating) || 4.5
        };
        
        if (!cleaned.name) throw new Error(`Item ${idx}: name is required`);
        if (!cleaned.category) throw new Error(`Item ${idx}: category is required`);
        if (cleaned.price === 0 || !cleaned.price) throw new Error(`Item ${idx}: price must be a valid number`);
        
        return cleaned;
      });
      
      const response = await axios.post(`${API}/frequent-items`, cleanedItems);
      console.log('✅ Removed item from frequent list on backend:', response.data);
    } catch (err) {
      console.error('❌ Error updating backend:', err.message);
      console.error('❌ Error details:', err.response?.data);
      alert(`Failed to remove: ${err.message || err.response?.data?.detail || err.message}`);
    }
  };

  const addToQuickAdd = async (product) => {
    const exists = quickAddOptions.find(item => item._id === product._id);
    if (!exists) {
      const newQuickAddItem = {
        _id: product._id,
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        image_url: product.image_url || null,
        description: product.description || null,
        is_veg: product.is_veg !== undefined ? product.is_veg : true
      };
      
      const updatedQuickAddItems = [...quickAddOptions, newQuickAddItem];
      setQuickAddOptions(updatedQuickAddItems);
      
      // Save to backend - ensure all items have required fields
      try {
        const cleanedItems = updatedQuickAddItems.map((item, idx) => {
          // Ensure required fields are present and correct type
          const cleaned = {
            _id: item._id ? String(item._id).trim() : `item-${idx}`,
            id: item.id ? String(item.id).trim() : String(item._id).trim(),
            name: String(item.name || '').trim(),
            category: String(item.category || '').trim(),
            price: parseFloat(item.price) || 0,
            image_url: item.image_url ? String(item.image_url).trim() : null,
            description: item.description ? String(item.description).trim() : null,
            is_veg: Boolean(item.is_veg !== false) // Default to true
          };
          
          // Validate required fields
          if (!cleaned.name) throw new Error(`Item ${idx}: name is required`);
          if (!cleaned.category) throw new Error(`Item ${idx}: category is required`);
          if (cleaned.price === 0 || !cleaned.price) throw new Error(`Item ${idx}: price must be a valid number`);
          
          return cleaned;
        });
        
        console.log('✅ Cleaned items before sending:', JSON.stringify(cleanedItems, null, 2));
        const response = await axios.post(`${API}/quick-add-items`, cleanedItems);
        console.log('✅ Added item to quick add on backend:', response.data);
        alert('✓ Item added to Quick Add!');
      } catch (err) {
        console.error('❌ Error saving to backend:', err.message);
        console.error('❌ Error details:', err.response?.data);
        alert(`Failed to save: ${err.message || err.response?.data?.detail || err.message}`);
        // Revert state on error
        setQuickAddOptions(quickAddOptions);
      }
    } else {
      alert('This item is already in Quick Add');
    }
  };

  const handleEditFrequentItem = (item) => {
    setEditingFrequentItem(item._id);
    setFrequentItemForm({
      delivery_time: item.delivery_time || '15 mins',
      discount: item.discount || 0,
      rating: item.rating || 4.5
    });
  };

  const handleSaveFrequentItem = async (itemId) => {
    const updatedItems = frequentItems.map(item => 
      item._id === itemId 
        ? { ...item, ...frequentItemForm }
        : item
    );
    setFrequentItems(updatedItems);
    
    // Save to backend MongoDB with cleaned data
    try {
      const cleanedItems = updatedItems.map((item, idx) => {
        const cleaned = {
          _id: String(item._id || `item-${idx}`).trim(),
          name: String(item.name || '').trim(),
          category: String(item.category || '').trim(),
          price: parseFloat(item.price) || 0,
          image_url: item.image_url ? String(item.image_url).trim() : null,
          description: item.description ? String(item.description).trim() : null,
          is_veg: Boolean(item.is_veg !== false),
          delivery_time: String(item.delivery_time || '15 mins').trim(),
          discount: parseFloat(item.discount) || 0,
          rating: parseFloat(item.rating) || 4.5
        };
        
        if (!cleaned.name) throw new Error(`Item ${idx}: name is required`);
        if (!cleaned.category) throw new Error(`Item ${idx}: category is required`);
        if (cleaned.price === 0 || !cleaned.price) throw new Error(`Item ${idx}: price must be a valid number`);
        
        return cleaned;
      });
      
      const response = await axios.post(`${API}/frequent-items`, cleanedItems);
      console.log('✅ Saved frequent items to backend:', response.data);
      alert('✓ Frequent item updated successfully!');
    } catch (err) {
      console.error('❌ Error saving frequent items:', err.message);
      console.error('❌ Error details:', err.response?.data);
      alert(`Failed to save: ${err.message || err.response?.data?.detail || err.message}`);
    }
    
    setEditingFrequentItem(null);
    setFrequentItemForm({
      delivery_time: '',
      discount: '',
      rating: ''
    });
  };

  const updateQuickAddQuantity = (productId, quantity) => {
    setQuickAddItems(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const getTotalQuickAddItems = () => {
    return Object.values(quickAddItems).reduce((sum, qty) => sum + qty, 0);
  };

  const handleAddAllToCart = () => {
    const itemsToAdd = frequentItems
      .filter(item => quickAddItems[item.id] > 0)
      .map(item => ({
        ...item,
        quantity: quickAddItems[item.id]
      }));
    
    if (itemsToAdd.length > 0) {
      console.log('Adding items to cart:', itemsToAdd);
      alert(`Added ${itemsToAdd.length} items to cart!\n${itemsToAdd.map(i => `${i.name} x${i.quantity}`).join('\n')}`);
      // Reset quantities
      setQuickAddItems({});
    }
  };

  const updateSelectedQuickAddQuantity = (itemId, qty) => {
    setSelectedQuickAdd(prev => ({ ...prev, [itemId]: Math.max(0, qty) }));
  };

  const getTotalSelectedQuickAddItems = () => {
    return Object.values(selectedQuickAdd).reduce((sum, q) => sum + q, 0);
  };

  const getTotalSelectedQuickAddPrice = () => {
    return Object.entries(selectedQuickAdd).reduce((sum, [id, qty]) => {
      const it = quickAddOptions.find(i => i.id === id);
      return sum + (it ? it.price * qty : 0);
    }, 0);
  };

  const handleAddSelectedQuickAdd = () => {
    const itemsToAdd = quickAddOptions.filter(i => selectedQuickAdd[i.id] > 0)
      .map(i => ({ ...i, quantity: selectedQuickAdd[i.id] }));

    if (itemsToAdd.length > 0) {
      // For admin panel we just show a confirmation. Integrate with cart/context if needed.
      alert(`Adding ${itemsToAdd.length} quick-add items:\n${itemsToAdd.map(it => `${it.name} x${it.quantity}`).join('\n')}`);
      setSelectedQuickAdd({});
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* MAIN SCROLLABLE AREA (LEFT/CENTER) */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your categories and menu items</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center gap-2 bg-[#8B1538] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#6b0f2a] transition-all shadow-lg"
              >
                <Plus size={20} /> Category
              </button>
              <button
                onClick={() => openProductModal()}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                <Plus size={20} /> Product
              </button>
            </div>
          </header>

          {/* View Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'card'
                    ? 'bg-[#8B1538] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Menu size={18} /> Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#8B1538] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Menu size={18} /> List
              </button>
            </div>

            {/* Search Bar (visible in list view) */}
            {viewMode === 'list' && (
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 mx-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] shadow-sm"
              />
            )}
          </div>

          {/* Categories and Products Grid */}
          <div className="space-y-12">
            {categories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No categories found. Create categories first!
              </div>
            ) : (
              categories.map(category => {
                const categoryProducts = getCategoryProducts(category._id, category.name);
                return (
                  <section key={category._id}>
                    <div className="flex items-center gap-6 mb-6 border-b pb-4">
                      {/* Category Image */}
                      <div className="relative flex-shrink-0 group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-200 overflow-hidden shadow-lg border-2 border-gray-100 group-hover:border-[#8B1538] transition-all">
                          {category.image_url ? (
                            <img 
                              src={normalizeImageUrl(category.image_url)} 
                              alt={category.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { 
                                console.error('Image load error:', e.target.src);
                                e.target.style.display = 'none';
                              }} 
                              onLoad={() => console.log('Image loaded:', normalizeImageUrl(category.image_url))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                              <Menu size={32} />
                            </div>
                          )}
                        </div>
                        {/* Edit Image Button */}
                        <label className="absolute bottom-0 right-0 bg-[#8B1538] text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#6b0f2a] transition-all opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-transform">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCategoryImageChange(e, category._id)}
                            className="hidden"
                          />
                          <Edit2 size={16} />
                        </label>
                      </div>

                      {/* Category Info */}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-[#8B1538]">{category.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">{category.description || 'No description'}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                            {categoryProducts.length} Items
                          </span>
                          {/* Delete Category Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete category "${category.name}" and all ${categoryProducts.length} items? This cannot be undone.`)) {
                                handleDeleteCategory(category._id);
                              }
                            }}
                            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-600 transition-all shadow-md"
                            title="Delete this category and all its items"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CARD VIEW */}
                    {viewMode === 'card' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {getFilteredProducts(categoryProducts).length === 0 ? (
                          <div className="col-span-full text-center py-8 text-gray-500">
                            No products found in this category
                          </div>
                        ) : (
                          getFilteredProducts(categoryProducts).map(product => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                              <div className="relative h-40 bg-gray-200">
                                {product.image_url && <img 
                                  src={normalizeImageUrl(product.image_url)} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => { 
                                    console.error('Product image load error:', e.target.src);
                                    e.target.style.display = 'none';
                                  }}
                                  onLoad={() => console.log('Product image loaded:', normalizeImageUrl(product.image_url))}
                                />}
                                <div className="absolute top-3 right-3 flex gap-2">
                                  <button 
                                    onClick={() => addToQuickAdd(product)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-full text-green-600 shadow-md hover:scale-110 transition-transform hover:bg-green-50"
                                    title="Add to Quick Add"
                                  >
                                    <Plus size={18} />
                                  </button>
                                  <button 
                                    onClick={() => addToFrequent(product)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-full text-yellow-500 shadow-md hover:scale-110 transition-transform hover:bg-yellow-50"
                                    title="Add to Frequent"
                                  >
                                    <Menu size={18} />
                                  </button>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                                  <div className={`w-3 h-3 rounded-full mt-1 ${product.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                                <div className="mb-2">
                                  <p className="text-[#8B1538] font-black text-lg">₹{product.price}</p>
                                  {product.raw_materials && product.raw_materials.length > 0 && (
                                    <p className="text-xs text-gray-600">
                                      <span className="font-semibold">Making Cost: </span>
                                      ₹{(() => {
                                        return product.raw_materials.reduce((total, material) => {
                                          const invItem = inventoryItems.find(item => item._id === material.inventory_id);
                                          return total + ((invItem?.price_per_unit || 0) * (material.quantity || 0));
                                        }, 0).toFixed(2);
                                      })()}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditProduct(product)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                                  <button onClick={() => handleDeleteProduct(product._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* LIST VIEW */}
                    {viewMode === 'list' && (
                      <div className="space-y-3">
                        {getFilteredProducts(categoryProducts).length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No products match your search
                          </div>
                        ) : (
                          getFilteredProducts(categoryProducts).map(product => (
                            <div
                              key={product._id}
                              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                {product.image_url && (
                                  <img
                                    src={normalizeImageUrl(product.image_url)}
                                    alt={product.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                                    <div className={`w-3 h-3 rounded-full ${product.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                                  </div>
                                  {product.description && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{product.description}</p>
                                  )}
                                  {product.raw_materials && product.raw_materials.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      <span className="font-semibold">Making Cost: </span>
                                      ₹{(() => {
                                        return product.raw_materials.reduce((total, material) => {
                                          const invItem = inventoryItems.find(item => item._id === material.inventory_id);
                                          return total + ((invItem?.price_per_unit || 0) * (material.quantity || 0));
                                        }, 0).toFixed(2);
                                      })()}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-lg font-black text-[#8B1538] min-w-[60px] text-right">₹{product.price}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => addToQuickAdd(product)}
                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                    title="Add to Quick Add"
                                  >
                                    <Plus size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => addToFrequent(product)}
                                    className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                                    title="Add to Frequent"
                                  >
                                    <Menu size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-96 h-full bg-[#8B1538] text-white shadow-2xl">
        <div className="p-8 border-b border-[#a0153e]">
          <h2 className="text-2xl font-black">Frequent Items</h2>
          <p className="text-opacity-70 text-sm">Quick order management</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {frequentItems.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <Menu size={48} className="mx-auto mb-4" />
              <p>No items added yet</p>
            </div>
          ) : (
            frequentItems.map(item => (
              <div key={item._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">{item.category}</span>
                  <button onClick={() => removeFromFrequent(item._id)} className="hover:text-red-300">
                    <X size={16} />
                  </button>
                </div>
                <h4 className="font-bold mb-2">{item.name}</h4>

                {/* Edit Mode */}
                {editingFrequentItem === item._id ? (
                  <div className="space-y-2 mb-4 text-sm">
                    <div>
                      <label className="text-xs opacity-70">Delivery Time</label>
                      <input
                        type="text"
                        value={frequentItemForm.delivery_time}
                        onChange={(e) => setFrequentItemForm({ ...frequentItemForm, delivery_time: e.target.value })}
                        placeholder="e.g., 15 mins"
                        className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs opacity-70">Discount (%)</label>
                      <input
                        type="number"
                        value={frequentItemForm.discount}
                        onChange={(e) => setFrequentItemForm({ ...frequentItemForm, discount: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs opacity-70">Rating (0-5)</label>
                      <input
                        type="number"
                        value={frequentItemForm.rating}
                        onChange={(e) => setFrequentItemForm({ ...frequentItemForm, rating: parseFloat(e.target.value) || 0 })}
                        placeholder="4.5"
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleSaveFrequentItem(item._id)}
                        className="flex-1 bg-yellow-400 text-[#8B1538] font-bold py-1 rounded text-xs hover:bg-yellow-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingFrequentItem(null)}
                        className="flex-1 bg-white/10 text-white font-bold py-1 rounded text-xs hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* View Mode */}
                    <div className="space-y-1 text-xs mb-3 opacity-80">
                      <div>⏱️ {item.delivery_time || '15 mins'}</div>
                      <div>🏷️ {item.discount || 0}% OFF</div>
                      <div>⭐ {item.rating || 4.5} rating</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-yellow-400">₹{item.price}</span>
                      <button
                        onClick={() => handleEditFrequentItem(item)}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 rounded text-xs font-bold text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}

          {/* Quick Add Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-extrabold">Quick Add</h3>
                <p className="text-sm opacity-80">Add common items quickly</p>
              </div>
              <button
                onClick={() => {
                  const productToAdd = products[Math.floor(Math.random() * products.length)];
                  if (productToAdd && !quickAddOptions.find(item => item._id === productToAdd._id)) {
                    const updatedOptions = [...quickAddOptions, {
                      _id: productToAdd._id,
                      id: productToAdd._id,
                      name: productToAdd.name,
                      description: productToAdd.description || '',
                      price: productToAdd.price,
                      category: productToAdd.category,
                      image_url: productToAdd.image_url
                    }];
                    setQuickAddOptions(updatedOptions);
                    saveQuickAddItems(updatedOptions);
                  }
                }}
                className="p-1.5 bg-yellow-400 text-[#8B1538] rounded-lg hover:bg-yellow-300 transition-colors"
                title="Add item to Quick Add"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
              {quickAddOptions.length === 0 ? (
                <div className="text-center py-4 text-sm opacity-60">
                  No quick add items yet
                </div>
              ) : (
                quickAddOptions.map(item => (
                  <div key={item.id || item._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{item.name}</div>
                      <div className="text-xs opacity-70">₹{item.price} · {item.category}</div>
                    </div>
                    <button
                      onClick={() => {
                        const updatedOptions = quickAddOptions.filter(i => (i.id || i._id) !== (item.id || item._id));
                        setQuickAddOptions(updatedOptions);
                        saveQuickAddItems(updatedOptions);
                      }}
                      className="ml-2 p-1 bg-red-500/20 hover:bg-red-500/40 rounded text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove from Quick Add"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              {getTotalSelectedQuickAddItems() > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Items</span>
                    <span className="font-black">{getTotalSelectedQuickAddItems()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Price</span>
                    <span className="font-black">₹{getTotalSelectedQuickAddPrice()}</span>
                  </div>
                  <button onClick={handleAddSelectedQuickAdd} className="mt-3 w-full bg-yellow-400 text-[#8B1538] font-black py-3 rounded-2xl shadow-xl hover:bg-yellow-300">Add Selected</button>
                </div>
              ) : (
                <div className="text-center text-sm opacity-70 mt-3">Select items to add</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-[#6B0F2A]">
          <button className="w-full bg-yellow-400 text-[#8B1538] font-black py-4 rounded-2xl shadow-xl hover:bg-yellow-300 transform active:scale-95 transition-all">
            PROCESS ORDER
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-[#8B1538] text-white p-4 rounded-full shadow-2xl z-50"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar Modal */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />
          
          {/* Modal Sidebar */}
          <div className="relative w-full max-w-xs h-full bg-[#8B1538] text-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="p-8 border-b border-[#a0153e]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Frequent Items</h2>
                  <p className="text-opacity-70 text-sm">Quick order management</p>
                </div>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-[#6B0F2A] rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {frequentItems.length === 0 ? (
                <div className="text-center py-20 opacity-40">
                  <Menu size={48} className="mx-auto mb-4" />
                  <p>No items added yet</p>
                </div>
              ) : (
                frequentItems.map(item => (
                  <div key={item._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">{item.category}</span>
                      <button onClick={() => removeFromFrequent(item._id)} className="hover:text-red-300">
                        <X size={16} />
                      </button>
                    </div>
                    <h4 className="font-bold mb-2">{item.name}</h4>

                    {/* Edit Mode */}
                    {editingFrequentItem === item._id ? (
                      <div className="space-y-2 mb-4 text-sm">
                        <div>
                          <label className="text-xs opacity-70">Delivery Time</label>
                          <input
                            type="text"
                            value={frequentItemForm.delivery_time}
                            onChange={(e) => setFrequentItemForm({ ...frequentItemForm, delivery_time: e.target.value })}
                            placeholder="e.g., 15 mins"
                            className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs opacity-70">Discount (%)</label>
                          <input
                            type="number"
                            value={frequentItemForm.discount}
                            onChange={(e) => setFrequentItemForm({ ...frequentItemForm, discount: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                            min="0"
                            max="100"
                            className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs opacity-70">Rating (0-5)</label>
                          <input
                            type="number"
                            value={frequentItemForm.rating}
                            onChange={(e) => setFrequentItemForm({ ...frequentItemForm, rating: parseFloat(e.target.value) || 0 })}
                            placeholder="4.5"
                            min="0"
                            max="5"
                            step="0.1"
                            className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleSaveFrequentItem(item._id)}
                            className="flex-1 bg-yellow-400 text-[#8B1538] font-bold py-1 rounded text-xs hover:bg-yellow-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingFrequentItem(null)}
                            className="flex-1 bg-white/10 text-white font-bold py-1 rounded text-xs hover:bg-white/20"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* View Mode */}
                        <div className="space-y-1 text-xs mb-3 opacity-80">
                          <div>⏱️ {item.delivery_time || '15 mins'}</div>
                          <div>🏷️ {item.discount || 0}% OFF</div>
                          <div>⭐ {item.rating || 4.5} rating</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-yellow-400">₹{item.price}</span>
                          <button
                            onClick={() => handleEditFrequentItem(item)}
                            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 rounded text-xs font-bold text-blue-300 transition-colors"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="flex items-center gap-3 bg-black/20 rounded-xl px-3 py-1.5 mt-3">
                          <button onClick={() => updateQuickAddQuantity(item._id, (quickAddItems[item._id] || 0) - 1)} className="hover:text-yellow-400 font-bold">−</button>
                          <span className="min-w-[20px] text-center font-mono">{quickAddItems[item._id] || 0}</span>
                          <button onClick={() => updateQuickAddQuantity(item._id, (quickAddItems[item._id] || 0) + 1)} className="hover:text-yellow-400 font-bold">+</button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}

              {/* Mobile Quick Add Section */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-extrabold">Quick Add</h3>
                <p className="text-sm opacity-80">Add common items quickly</p>

                <div className="mt-4 space-y-3">
                  {quickAddOptions.map(item => (
                    <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold">{item.name}</div>
                        <div className="text-xs opacity-70">₹{item.price} · {item.category}</div>
                      </div>
                      <div className="flex items-center gap-3 bg-black/20 rounded-xl px-3 py-1.5">
                        <button onClick={() => updateSelectedQuickAddQuantity(item.id, (selectedQuickAdd[item.id] || 0) - 1)} className="hover:text-yellow-400 font-bold">−</button>
                        <span className="min-w-[20px] text-center font-mono">{selectedQuickAdd[item.id] || 0}</span>
                        <button onClick={() => updateSelectedQuickAddQuantity(item.id, (selectedQuickAdd[item.id] || 0) + 1)} className="hover:text-yellow-400 font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  {getTotalSelectedQuickAddItems() > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Items</span>
                        <span className="font-black">{getTotalSelectedQuickAddItems()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Price</span>
                        <span className="font-black">₹{getTotalSelectedQuickAddPrice()}</span>
                      </div>
                      <button onClick={handleAddSelectedQuickAdd} className="mt-3 w-full bg-yellow-400 text-[#8B1538] font-black py-3 rounded-2xl shadow-xl">Add Selected</button>
                    </div>
                  ) : (
                    <div className="text-center text-sm opacity-70 mt-3">Select items to add</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#6B0F2A]">
              <button className="w-full bg-yellow-400 text-[#8B1538] font-black py-4 rounded-2xl shadow-xl hover:bg-yellow-300 transform active:scale-95 transition-all">
                PROCESS ORDER
              </button>
            </div>
          </div>
        </div>
      )}

    {/* MODALS - Outside main flex container */}
    {showCategoryModal && (
        <Modal onClose={closeCategoryModal}>
          <ModalHeader title={editingCategory ? 'Edit Category' : 'Create Category'} onClose={closeCategoryModal} />
          <form onSubmit={handleCategorySubmit} className="space-y-4 p-6">
            <div>
              <label className="block font-semibold mb-2 text-sm">Category Name *</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                placeholder="e.g., Beverages"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Description</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                placeholder="Category description"
                rows="3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Category Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {imagePreview && (
                  <img 
                    src={normalizeImageUrl(imagePreview)} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#8B1538]" 
                    onError={(e) => { 
                      console.warn('Category preview load error:', e.target.src);
                      e.target.src = '/api/uploads/placeholder.png';
                    }} 
                  />
                )}
              </div>
              {categoryForm.image_url && <p className="text-xs text-green-600 mt-1">✓ Image uploaded</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-sm">Display Order</label>
                <input
                  type="number"
                  value={categoryForm.display_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Active</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryForm.active}
                    onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#A0153E] transition-all"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <Modal onClose={closeProductModal}>
          <ModalHeader title={editingProduct ? 'Edit Product' : 'Add Product'} onClose={closeProductModal} />
          <form onSubmit={handleProductSubmit} className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-sm">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="e.g., Iced Coffee"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Category *</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Product description"
                rows="2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Product Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {productImagePreview && (
                  <img 
                    src={normalizeImageUrl(productImagePreview)} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-lg object-cover border-2 border-green-600" 
                    onError={(e) => { 
                      console.warn('Product preview load error:', e.target.src);
                      e.target.src = '/api/uploads/placeholder.png';
                    }} 
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-sm">Type</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_veg}
                    onChange={(e) => setProductForm({ ...productForm, is_veg: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">{productForm.is_veg ? 'Vegetarian' : 'Non-Veg'}</span>
                </label>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Active</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            {/* RAW MATERIALS / RECIPE SECTION */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#8B1538]">Raw Materials (Recipe)</h4>
                <button
                  type="button"
                  onClick={addRawMaterial}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Material
                </button>
              </div>

              {/* DEBUG LOG */}
              {productForm.raw_materials.length === 0 && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                  📋 Debug: raw_materials.length = {productForm.raw_materials.length}, type = {typeof productForm.raw_materials}
                  {editingProduct && ` (editing: ${editingProduct.name})`}
                </div>
              )}

              {productForm.raw_materials.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No materials added yet</p>
              ) : (
                <div className="space-y-3">
                  {productForm.raw_materials.map((material, idx) => {
                    const selectedInventory = inventoryItems.find(item => item._id === material.inventory_id);
                    const materialCost = selectedInventory ? (selectedInventory.price_per_unit || 0) * (material.quantity || 0) : 0;
                    
                    return (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={material.inventory_id}
                            onChange={(e) => updateRawMaterial(idx, 'inventory_id', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="">Select inventory item</option>
                            {inventoryItems.map(item => (
                              <option key={item._id} value={item._id}>
                                {item.item_name} (₹{item.price_per_unit?.toFixed(2)}/{item.unit})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeRawMaterial(idx)}
                            className="px-2 py-2 bg-red-500/20 text-red-600 rounded hover:bg-red-500/30 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600 font-semibold">Qty Needed</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                value={material.quantity}
                                onChange={(e) => updateRawMaterial(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="0"
                              />
                              <span className="text-xs text-gray-600 font-semibold">{selectedInventory?.unit || 'unit'}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 font-semibold">Cost</label>
                            <div className="px-2 py-1 bg-white border border-green-300 rounded text-xs font-bold text-green-700">
                              ₹ {materialCost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total Making Cost */}
              {productForm.raw_materials.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-green-300 rounded-lg space-y-3">
                  {/* Raw Materials Breakdown */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h5 className="font-bold text-xs text-gray-700 mb-2 uppercase tracking-wide">📋 Materials Breakdown</h5>
                    <div className="space-y-2">
                      {productForm.raw_materials.map((material, idx) => {
                        const selectedInventory = inventoryItems.find(item => item._id === material.inventory_id);
                        const materialCost = selectedInventory ? 
                          (selectedInventory.price_per_unit || 0) * (material.quantity || 0) : 0;
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-700">{selectedInventory?.item_name || 'Unknown'}</p>
                              <p className="text-gray-500 text-xs">
                                {material.quantity} {selectedInventory?.unit} × ₹{(selectedInventory?.price_per_unit || 0).toFixed(2)}
                              </p>
                            </div>
                            <span className="font-bold text-blue-600 ml-2">₹ {materialCost.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="space-y-2 pt-2 border-t-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-700">💰 Total Cost to Make:</span>
                      <span className="font-bold text-lg text-green-700">₹ {calculateMakingCost().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Selling Price:</span>
                      <span className="text-xs font-bold text-blue-700">₹ {parseFloat(productForm.price || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                      <span className="text-xs text-gray-600">✓ Profit Margin:</span>
                      <span className={`text-xs font-bold ${(parseFloat(productForm.price || 0) - calculateMakingCost()) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        ₹ {(parseFloat(productForm.price || 0) - calculateMakingCost()).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Profit % */}
                  {calculateMakingCost() > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Profit Percentage:</span>
                        <span className={`text-sm font-bold ${
                          ((parseFloat(productForm.price || 0) - calculateMakingCost()) / calculateMakingCost()) * 100 >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {(((parseFloat(productForm.price || 0) - calculateMakingCost()) / calculateMakingCost()) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                type="button"
                onClick={closeProductModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                {editingProduct ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// MODAL COMPONENT
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
    <h3 className="font-bold text-lg">{title}</h3>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      <X size={24} />
    </button>
  </div>
);

export default AdminCategoryManager;
