import { useState, useEffect } from 'react';
import { FaSearch, FaBook, FaLaptop, FaTag, FaTrophy, FaMusic, FaCoffee, FaEllipsisH } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { useProductStore } from '../store/productStore';

const Home = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const productCategories = [
    {
      id: 'Books & Stationery',
      name: 'Books & Stationery',
      icon: FaBook,
      color: 'from-amber-400 to-amber-600',
      description: 'Books, notes & stationery items'
    },
    {
      id: 'Electronics',
      name: 'Electronics',
      icon: FaLaptop,
      color: 'from-green-400 to-green-600',
      description: 'Laptops, phones & gadgets'
    },
    {
      id: 'Clothing',
      name: 'Clothing',
      icon: FaTag,
      color: 'from-pink-400 to-pink-600',
      description: 'Fashion & apparel'
    },
    {
      id: 'Furniture',
      name: 'Furniture',
      icon: FaCoffee,
      color: 'from-orange-400 to-orange-600',
      description: 'Room & study furniture'
    },
    {
      id: 'Sport Items',
      name: 'Sport Items',
      icon: FaTrophy,
      color: 'from-green-400 to-green-600',
      description: 'Sports equipment & gear'
    },
    {
      id: 'Music Instruments',
      name: 'Music Instruments',
      icon: FaMusic,
      color: 'from-purple-400 to-purple-600',
      description: 'Musical instruments & audio'
    },
    {
      id: 'Handmade Creations',
      name: 'Handmade Creations',
      icon: FaEllipsisH,
      color: 'from-red-400 to-red-600',
      description: 'Unique handmade items'
    },
    {
      id: 'Other',
      name: 'Other',
      icon: FaEllipsisH,
      color: 'from-gray-400 to-gray-600',
      description: 'Everything else'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products', { search: searchQuery });
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (categoryId) => {
    onNavigate('products', { category: categoryId });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="home" onNavigate={onNavigate} />

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">Find Everything You Need</h2>
          <p className="text-xl text-green-100 mb-8">Buy and sell campus essentials in one place</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, books, electronics..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Product Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h3>
        <p className="text-gray-600 mb-12">Browse through our popular categories</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-white transform transition hover:scale-105 hover:shadow-2xl`}>
                  <Icon className="text-6xl mb-4 group-hover:scale-110 transition" />
                  <h4 className="text-2xl font-bold mb-2 text-center">{category.name}</h4>
                  <p className="text-sm text-center opacity-90">{category.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose StudentHub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-blue-50">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Verified Users</h4>
              <p className="text-gray-600">Trade safely with verified student accounts</p>
            </div>
            <div className="text-center p-8 rounded-lg bg-green-50">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Quick & Easy</h4>
              <p className="text-gray-600">List your items in seconds and start selling</p>
            </div>
            <div className="text-center p-8 rounded-lg bg-purple-50">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Campus Connect</h4>
              <p className="text-gray-600">Connect with students on your campus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
