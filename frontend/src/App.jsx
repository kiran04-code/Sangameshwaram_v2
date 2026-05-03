import React from 'react';
import '@/App.css';
import './i18n';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import StockDashboard from './pages/StockDashboard';
import KitchenDisplay from './pages/KitchenDisplay';
import CustomerDisplay from './pages/CustomerDisplay';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BottomNavigation from './components/BottomNavigation';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import useLenisScroll from './hooks/useLenisScroll';

function App() {
  useLenisScroll();

  return (
    <AdminProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App min-h-screen indian-pattern-bg">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/waiter/dashboard" element={<WaiterDashboard />} />
              <Route path="/stock/dashboard" element={<StockDashboard />} />
              <Route path="/kitchen" element={<KitchenDisplay />} />
              <Route path="/display" element={<CustomerDisplay />} />
            </Routes>
            <BottomNavigation />
            <FloatingWhatsApp />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
