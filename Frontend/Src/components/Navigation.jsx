import { FaHome, FaBox, FaCalendar, FaTrophy, FaUserCircle } from 'react-icons/fa';
import { useUserStore } from '../store/userStore';

const Navigation = ({ currentPage, onNavigate }) => {
  const { user, logout } = useUserStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: FaHome },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'events', label: 'Events', icon: FaCalendar },
    { id: 'sports', label: 'Sports', icon: FaTrophy },
    { id: 'profile', label: 'Profile', icon: FaUserCircle },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <h1 className="text-2xl font-bold text-green-600">StudentHub</h1>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    currentPage === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
