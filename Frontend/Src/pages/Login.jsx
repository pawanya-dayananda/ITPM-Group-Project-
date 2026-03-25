
import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useUserStore } from '../store/userStore';

const Login = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useUserStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    if (showRegister && !formData.name) {
      setError('Name is required');
      return false;
    }
    if (showRegister && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (showRegister) {
        result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          setError('✅ Registration successful! Please login.');
          setShowRegister(false);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } else {
          setError(result.message);
        }
      } else {
        result = await login(formData.email, formData.password);
        if (result.success) {
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          onNavigate('home');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-gray-800">StudentHub</h1>
          <p className="text-gray-600 mt-2">Your Campus Marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Register Only) */}
          {showRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Confirm Password Field (Register Only) */}
          {showRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="flex-1 outline-none"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes('✅') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : showRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Button */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {showRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setShowRegister(!showRegister);
                setError('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              {showRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {!showRegister && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold mb-2">Demo Login:</p>
            <p className="text-xs text-gray-600">📧 admin@test.com</p>
            <p className="text-xs text-gray-600">🔑 password123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
