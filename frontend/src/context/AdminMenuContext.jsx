import React, { createContext, useContext, useReducer } from 'react';

// Create context
const AdminMenuContext = createContext();

// Initial state
const initialState = {
  // UI State
  activeTab: 'categories',
  sidebarOpen: true,
  loading: false,
  error: null,
  success: null,

  // Categories
  categories: [],
  selectedCategory: null,
  categoriesLoading: false,

  // Menu Items
  menuItems: [],
  selectedMenuItem: null,
  menuItemsLoading: false,
  menuItemFilters: {
    category: null,
    isVeg: null,
    searchTerm: '',
  },

  // Featured Content
  frequentlyAccessedItems: [],
  quickAddItems: [],
  bestSellers: [],
  promoBanners: [],

  // Offers
  offers: [],
  selectedOffer: null,
  offersLoading: false,

  // Combos
  combos: [],
  selectedCombo: null,
  combosLoading: false,

  // Modals
  modals: {
    categoryForm: false,
    menuItemForm: false,
    imageUpload: false,
    confirmDelete: false,
    bulkOperations: false,
  },

  // Pagination
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

// Reducer function
function adminMenuReducer(state, action) {
  switch (action.type) {
    // UI Actions
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_SUCCESS':
      return { ...state, success: action.payload };

    case 'CLEAR_MESSAGES':
      return { ...state, error: null, success: null };

    // Categories Actions
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat._id !== action.payload),
      };

    case 'SET_CATEGORIES_LOADING':
      return { ...state, categoriesLoading: action.payload };

    // Menu Items Actions
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };

    case 'SET_SELECTED_MENU_ITEM':
      return { ...state, selectedMenuItem: action.payload };

    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [...state.menuItems, action.payload] };

    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
      };

    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.filter(item => item._id !== action.payload),
      };

    case 'SET_MENU_ITEMS_LOADING':
      return { ...state, menuItemsLoading: action.payload };

    case 'SET_MENU_ITEM_FILTERS':
      return {
        ...state,
        menuItemFilters: { ...state.menuItemFilters, ...action.payload },
      };

    // Featured Content Actions
    case 'SET_FREQUENTLY_ACCESSED_ITEMS':
      return { ...state, frequentlyAccessedItems: action.payload };

    case 'SET_QUICK_ADD_ITEMS':
      return { ...state, quickAddItems: action.payload };

    case 'SET_BEST_SELLERS':
      return { ...state, bestSellers: action.payload };

    case 'SET_PROMO_BANNERS':
      return { ...state, promoBanners: action.payload };

    // Offers Actions
    case 'SET_OFFERS':
      return { ...state, offers: action.payload };

    case 'SET_SELECTED_OFFER':
      return { ...state, selectedOffer: action.payload };

    case 'ADD_OFFER':
      return { ...state, offers: [...state.offers, action.payload] };

    case 'UPDATE_OFFER':
      return {
        ...state,
        offers: state.offers.map(offer =>
          offer._id === action.payload._id ? action.payload : offer
        ),
      };

    case 'DELETE_OFFER':
      return {
        ...state,
        offers: state.offers.filter(offer => offer._id !== action.payload),
      };

    case 'SET_OFFERS_LOADING':
      return { ...state, offersLoading: action.payload };

    // Combos Actions
    case 'SET_COMBOS':
      return { ...state, combos: action.payload };

    case 'SET_SELECTED_COMBO':
      return { ...state, selectedCombo: action.payload };

    case 'ADD_COMBO':
      return { ...state, combos: [...state.combos, action.payload] };

    case 'UPDATE_COMBO':
      return {
        ...state,
        combos: state.combos.map(combo =>
          combo._id === action.payload._id ? action.payload : combo
        ),
      };

    case 'DELETE_COMBO':
      return {
        ...state,
        combos: state.combos.filter(combo => combo._id !== action.payload),
      };

    case 'SET_COMBOS_LOADING':
      return { ...state, combosLoading: action.payload };

    // Modal Actions
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: true },
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: false },
      };

    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        modals: {
          categoryForm: false,
          menuItemForm: false,
          imageUpload: false,
          confirmDelete: false,
          bulkOperations: false,
        },
      };

    // Pagination Actions
    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pagination: { ...state.pagination, pageSize: action.payload },
      };

    case 'SET_TOTAL':
      return {
        ...state,
        pagination: { ...state.pagination, total: action.payload },
      };

    default:
      return state;
  }
}

// Provider component
export function AdminMenuProvider({ children }) {
  const [state, dispatch] = useReducer(adminMenuReducer, initialState);

  return (
    <AdminMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminMenuContext.Provider>
  );
}

// Custom hook to use context
export function useAdminMenu() {
  const context = useContext(AdminMenuContext);
  if (!context) {
    throw new Error('useAdminMenu must be used within AdminMenuProvider');
  }
  return context;
}

// Helper functions for common dispatch actions
export const adminMenuActions = {
  // UI
  setActiveTab: (tab) => ({ type: 'SET_ACTIVE_TAB', payload: tab }),
  setSidebarOpen: (open) => ({ type: 'SET_SIDEBAR_OPEN', payload: open }),
  setLoading: (loading) => ({ type: 'SET_LOADING', payload: loading }),
  setError: (error) => ({ type: 'SET_ERROR', payload: error }),
  setSuccess: (message) => ({ type: 'SET_SUCCESS', payload: message }),
  clearMessages: () => ({ type: 'CLEAR_MESSAGES' }),

  // Categories
  setCategories: (categories) => ({ type: 'SET_CATEGORIES', payload: categories }),
  setSelectedCategory: (category) => ({ type: 'SET_SELECTED_CATEGORY', payload: category }),
  addCategory: (category) => ({ type: 'ADD_CATEGORY', payload: category }),
  updateCategory: (category) => ({ type: 'UPDATE_CATEGORY', payload: category }),
  deleteCategory: (id) => ({ type: 'DELETE_CATEGORY', payload: id }),
  setCategoriesLoading: (loading) => ({ type: 'SET_CATEGORIES_LOADING', payload: loading }),

  // Menu Items
  setMenuItems: (items) => ({ type: 'SET_MENU_ITEMS', payload: items }),
  setSelectedMenuItem: (item) => ({ type: 'SET_SELECTED_MENU_ITEM', payload: item }),
  addMenuItem: (item) => ({ type: 'ADD_MENU_ITEM', payload: item }),
  updateMenuItem: (item) => ({ type: 'UPDATE_MENU_ITEM', payload: item }),
  deleteMenuItem: (id) => ({ type: 'DELETE_MENU_ITEM', payload: id }),
  setMenuItemsLoading: (loading) => ({ type: 'SET_MENU_ITEMS_LOADING', payload: loading }),
  setMenuItemFilters: (filters) => ({ type: 'SET_MENU_ITEM_FILTERS', payload: filters }),

  // Featured Content
  setFrequentlyAccessedItems: (items) => ({ type: 'SET_FREQUENTLY_ACCESSED_ITEMS', payload: items }),
  setQuickAddItems: (items) => ({ type: 'SET_QUICK_ADD_ITEMS', payload: items }),
  setBestSellers: (items) => ({ type: 'SET_BEST_SELLERS', payload: items }),
  setPromoBanners: (banners) => ({ type: 'SET_PROMO_BANNERS', payload: banners }),

  // Offers
  setOffers: (offers) => ({ type: 'SET_OFFERS', payload: offers }),
  setSelectedOffer: (offer) => ({ type: 'SET_SELECTED_OFFER', payload: offer }),
  addOffer: (offer) => ({ type: 'ADD_OFFER', payload: offer }),
  updateOffer: (offer) => ({ type: 'UPDATE_OFFER', payload: offer }),
  deleteOffer: (id) => ({ type: 'DELETE_OFFER', payload: id }),
  setOffersLoading: (loading) => ({ type: 'SET_OFFERS_LOADING', payload: loading }),

  // Combos
  setCombos: (combos) => ({ type: 'SET_COMBOS', payload: combos }),
  setSelectedCombo: (combo) => ({ type: 'SET_SELECTED_COMBO', payload: combo }),
  addCombo: (combo) => ({ type: 'ADD_COMBO', payload: combo }),
  updateCombo: (combo) => ({ type: 'UPDATE_COMBO', payload: combo }),
  deleteCombo: (id) => ({ type: 'DELETE_COMBO', payload: id }),
  setCombosLoading: (loading) => ({ type: 'SET_COMBOS_LOADING', payload: loading }),

  // Modals
  openModal: (modalName) => ({ type: 'OPEN_MODAL', payload: modalName }),
  closeModal: (modalName) => ({ type: 'CLOSE_MODAL', payload: modalName }),
  closeAllModals: () => ({ type: 'CLOSE_ALL_MODALS' }),

  // Pagination
  setPage: (page) => ({ type: 'SET_PAGE', payload: page }),
  setPageSize: (pageSize) => ({ type: 'SET_PAGE_SIZE', payload: pageSize }),
  setTotal: (total) => ({ type: 'SET_TOTAL', payload: total }),
};
