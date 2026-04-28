import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API_BASE = `${BACKEND_URL}/api/admin`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const adminAPI = {
  // Categories
  getCategories: () => apiClient.get('/categories'),
  createCategory: (data) => apiClient.post('/categories', data),
  updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
  uploadCategoryImage: (file, categoryId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    const params = categoryId ? `?category_id=${categoryId}` : '';
    return apiClient.post(`/upload/category-image${params}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Menu Items
  getMenuItems: (filters = {}) => apiClient.get('/menu-items', { params: filters }),
  getMenuItem: (id) => apiClient.get(`/menu-items/${id}`),
  createMenuItem: (data) => apiClient.post('/menu-items', data),
  updateMenuItem: (id, data) => apiClient.put(`/menu-items/${id}`, data),
  deleteMenuItem: (id) => apiClient.delete(`/menu-items/${id}`),
  uploadMenuItemImage: (file, itemId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    const params = itemId ? `?item_id=${itemId}` : '';
    return apiClient.post(`/upload/menu-item-image${params}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  bulkDeleteMenuItems: (ids) => apiClient.post('/menu-items/bulk-delete', { ids }),
  bulkImportMenuItems: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/menu-items/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Frequently Accessed Items
  getFrequentlyAccessedItems: () => apiClient.get('/frequently-accessed'),
  addFrequentlyAccessedItem: (itemId) =>
    apiClient.post('/frequently-accessed', { menu_item_id: itemId }),
  removeFrequentlyAccessedItem: (id) =>
    apiClient.delete(`/frequently-accessed/${id}`),
  reorderFrequentlyAccessedItems: (order) =>
    apiClient.put('/frequently-accessed/reorder', { order }),
  getFrequentlyAccessedAnalytics: () =>
    apiClient.get('/frequently-accessed/analytics'),

  // Quick Add Items
  getQuickAddItems: () => apiClient.get('/quick-add-items'),
  addQuickAddItem: (itemId) =>
    apiClient.post('/quick-add-items', { menu_item_id: itemId }),
  removeQuickAddItem: (id) => apiClient.delete(`/quick-add-items/${id}`),
  reorderQuickAddItems: (order) =>
    apiClient.put('/quick-add-items/reorder', { order }),

  // Offers
  getOffers: (filters = {}) => apiClient.get('/offers', { params: filters }),
  getOffer: (id) => apiClient.get(`/offers/${id}`),
  createOffer: (data) => apiClient.post('/offers', data),
  updateOffer: (id, data) => apiClient.put(`/offers/${id}`, data),
  deleteOffer: (id) => apiClient.delete(`/offers/${id}`),
  duplicateOffer: (id) => apiClient.post(`/offers/${id}/duplicate`),
  getOffersAnalytics: () => apiClient.get('/offers/analytics'),

  // Best Sellers
  getBestSellers: () => apiClient.get('/best-sellers'),
  addBestSeller: (itemId) =>
    apiClient.post('/best-sellers', { menu_item_id: itemId }),
  removeBestSeller: (id) => apiClient.delete(`/best-sellers/${id}`),
  reorderBestSellers: (order) =>
    apiClient.put('/best-sellers/reorder', { order }),
  getBestSellersAnalytics: () => apiClient.get('/best-sellers/analytics'),

  // Promo Banners
  getPromoBanners: () => apiClient.get('/promo-banners'),
  getPromoBanner: (id) => apiClient.get(`/promo-banners/${id}`),
  createPromoBanner: (data) => apiClient.post('/promo-banners', data),
  updatePromoBanner: (id, data) =>
    apiClient.put(`/promo-banners/${id}`, data),
  deletePromoBanner: (id) => apiClient.delete(`/promo-banners/${id}`),
  uploadPromoBannerImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/promo-banners/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPromoBannersAnalytics: () =>
    apiClient.get('/promo-banners/analytics'),

  // Combos
  getCombos: () => apiClient.get('/combos'),
  getCombo: (id) => apiClient.get(`/combos/${id}`),
  createCombo: (data) => apiClient.post('/combos', data),
  updateCombo: (id, data) => apiClient.put(`/combos/${id}`, data),
  deleteCombo: (id) => apiClient.delete(`/combos/${id}`),
  getCombosAnalytics: () => apiClient.get('/combos/analytics'),
};

export default apiClient;
