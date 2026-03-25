// imports
import { useState, useEffect } from 'react';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Sports from "./pages/Sports";
import { useUserStore } from "./store/userStore";

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [filterParams, setFilterParams] = useState({});
  const { initializeUser, isAuthenticated } = useUserStore();

  useEffect(() => {
    // Initialize user on app load
    initializeUser();
  }, [initializeUser]);

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setFilterParams(params);
  };

  // If user is not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' && (
        <Home onNavigate={handleNavigate} />
      )}
      {currentPage === 'products' && (
        <Products
          onNavigate={handleNavigate}
          category={filterParams.category}
          search={filterParams.search}
        />
      )}
      {currentPage === 'events' && (
        <Events onNavigate={handleNavigate} />
      )}
      {currentPage === 'sports' && (
        <Sports onNavigate={handleNavigate} />
      )}
      {currentPage === 'profile' && (
        <Profile onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;


