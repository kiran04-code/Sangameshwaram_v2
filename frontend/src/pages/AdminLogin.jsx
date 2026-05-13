import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Lock, LogIn, User } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import LanguageSwitcher from '../components/LanguageSwitcher'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

console.log('Backend URL:', BACKEND_URL);
console.log('API URL:', API);

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with username:', username);
      const response = await axios.post(`${API}/login`, { username, password });
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        login(response.data.token);
        
        // Role-based routing
        const role = response.data.role;
        console.log('User role:', role);
        
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'waiter') {
          navigate('/waiter/dashboard');
        } else if (role === 'stock_manager') {
          navigate('/stock/dashboard');
        } else if (role === 'display') {
          navigate('/display');
        } else {
          // Default to admin dashboard if role not recognized
          navigate('/admin/dashboard');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Invalid credentials';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)' }}>
      {/* Decorative Corners */}
      <div className="mandala-corner top-left opacity-30"></div>
      <div className="mandala-corner top-right opacity-30"></div>
      <div className="mandala-corner bottom-left opacity-30"></div>
      <div className="mandala-corner bottom-right opacity-30"></div>

      <div className="glass-dark rounded-3xl p-8 md:p-12 max-w-md w-full relative z-10">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <img src="https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png" alt="The Sangameshwaram Cafe" className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-[#FFD700] shadow-xl" />
          <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>The Sangameshwaram Cafe</h1>
          <p className="text-white/80">{t('waiter_dashboard')} / {t('stock_dashboard')} / {t('admin_dashboard')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">{t('username') || 'Username'}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                data-testid="username-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">{t('password') || 'Password'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              data-testid="password-input"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-white text-sm" data-testid="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 text-lg py-4"
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : (
              <>
                <LogIn size={20} />
                {t('login') || 'Login'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-sm"
          >
            ← {t('home')}
          </button>
        </div>

        <div className="mt-8 p-4 bg-white/10 rounded-xl space-y-2 text-white/60 text-xs">
          <p className="font-bold text-white">Demo Credentials:</p>
          <p>Admin: admin / admin123</p>
          <p>Waiter: waiter1 / waiter123</p>
          <p>Stock: stock1 / stock123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
