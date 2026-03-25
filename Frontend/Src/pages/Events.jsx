import { FaCalendar } from 'react-icons/fa';
import Navigation from '../components/Navigation';

const Events = ({ onNavigate }) => {
  const upcomingEvents = [
    {
      id: 1,
      name: 'Campus Book Fair',
      date: 'March 28, 2026',
      location: 'Central Quad',
      description: 'Buy and sell textbooks and study materials'
    },
    {
      id: 2,
      name: 'Tech Fest Essentials Market',
      date: 'April 5, 2026',
      location: 'Tech Building',
      description: 'Electronics, gadgets, and tech accessories'
    },
    {
      id: 3,
      name: 'Hostel Swap Meet',
      date: 'April 12, 2026',
      location: 'Sports Complex',
      description: 'Buy and exchange hostel room furniture and items'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="events" onNavigate={onNavigate} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <FaCalendar className="text-green-600" />
          Upcoming Events
        </h1>
        <p className="text-gray-600 mb-12">Join our events to buy, sell, and network with students</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCalendar className="text-green-600 text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
              </div>
              <p className="text-gray-600 mb-2 font-semibold">{event.date}</p>
              <p className="text-gray-600 mb-4">{event.location}</p>
              <p className="text-gray-700 mb-6">{event.description}</p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
