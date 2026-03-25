import { FaTrophy } from 'react-icons/fa';
import Navigation from '../components/Navigation';

const Sports = ({ onNavigate }) => {
  const sportsCategories = [
    {
      id: 1,
      name: 'Cricket',
      icon: '🏏',
      description: 'Cricket equipment and accessories'
    },
    {
      id: 2,
      name: 'Football',
      icon: '⚽',
      description: 'Football gear and training equipment'
    },
    {
      id: 3,
      name: 'Badminton',
      icon: '🏸',
      description: 'Rackets, shuttles, and accessories'
    },
    {
      id: 4,
      name: 'Basketball',
      icon: '🏀',
      description: 'Balls, shoes, and basketball gear'
    },
    {
      id: 5,
      name: 'Tennis',
      icon: '🎾',
      description: 'Tennis rackets and accessories'
    },
    {
      id: 6,
      name: 'Fitness',
      icon: '💪',
      description: 'Gym equipment and fitness gear'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="sports" onNavigate={onNavigate} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <FaTrophy className="text-blue-600" />
          Sports & Fitness
        </h1>
        <p className="text-gray-600 mb-12">Buy and sell sports equipment on campus</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsCategories.map(category => (
            <button
              key={category.id}
              onClick={() => onNavigate('products', { category: category.name })}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition text-left group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">{category.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition">
                Browse items →
              </div>
            </button>
          ))}
        </div>

        {/* Promotions */}
        <div className="mt-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Special Sports Sale</h2>
          <p className="text-lg mb-6">Get up to 50% off on selected sports equipment this month!</p>
          <button onClick={() => onNavigate('products')} className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sports;
