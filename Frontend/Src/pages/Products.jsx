import { useState, useEffect } from 'react';
import { FaBox, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

const Products = ({ onNavigate, category, search: initialSearch }) => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { userId } = useUserStore();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearch || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const productTypes = [
    'Books & Stationery',
    'Electronics',
    'Clothing',
    'Furniture',
    'Sport Items',
    'Music Instruments',
    'Handmade Creations',
    'Other'
  ];

  const statuses = ['Available', 'Sold', 'Reserved'];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update selected category when category prop changes
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.ProductType === selectedCategory);
    }

    // Filter by search
    if (searchInput) {
      filtered = filtered.filter(p =>
        p.ProductName?.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.Description?.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(p => p.Price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.Price <= parseFloat(priceRange.max));
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    setFilteredProducts(filtered);
  }, [products, searchInput, priceRange, selectedStatus, selectedCategory]);

  const handleClearFilters = () => {
    setSearchInput('');
    setPriceRange({ min: '', max: '' });
    setSelectedStatus('');
    setSelectedCategory('');
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
    fetchProductReviews(product._id);
  };

  const fetchProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/${productId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!rating || !comment) {
      setReviewError('Please select a rating and enter a comment.');
      return;
    }
    if (!userId) {
      setReviewError('Please log in to add a review.');
      return;
    }
    try {
      await axios.post(`${API_URL}/${selectedProduct._id}/reviews`, {
        userId,
        rating: parseInt(rating),
        comment
      });
      setRating('');
      setComment('');
      fetchProductReviews(selectedProduct._id);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to add review. Please try again.');
      console.error('Error adding review:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="products" onNavigate={onNavigate} />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="products" onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter /> Filters
                </h3>
                {(searchInput || priceRange.min || priceRange.max || selectedStatus || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold px-2 py-1 bg-red-50 rounded"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              {(searchInput || priceRange.min || priceRange.max || selectedStatus || selectedCategory) && (
                <div className="mb-6 pb-6 border-b-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Active Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-2">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('')} className="hover:text-blue-900">✕</button>
                      </span>
                    )}
                    {searchInput && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-2">
                        "{searchInput.substring(0, 10)}{searchInput.length > 10 ? '...' : ''}"
                        <button onClick={() => setSearchInput('')} className="hover:text-green-900">✕</button>
                      </span>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-2">
                        ₹{priceRange.min || '0'}-{priceRange.max || '∞'}
                        <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-purple-900">✕</button>
                      </span>
                    )}
                    {selectedStatus && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-2">
                        {selectedStatus}
                        <button onClick={() => setSelectedStatus('')} className="hover:text-orange-900">✕</button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                      selectedCategory === '' ? 'bg-green-600 text-white font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Categories
                    {selectedCategory === '' && <span className="text-lg">✓</span>}
                  </button>
                  {productTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedCategory(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                        selectedCategory === type ? 'bg-green-600 text-white font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                      {selectedCategory === type && <span className="text-lg">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="Min Price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="Max Price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedStatus('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                      selectedStatus === '' ? 'bg-green-600 text-white font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Status
                    {selectedStatus === '' && <span className="text-lg">✓</span>}
                  </button>
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 justify-between ${
                        selectedStatus === status ? 'bg-green-600 text-white font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          status === 'Available' ? 'bg-green-500' :
                          status === 'Sold' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></span>
                        {status}
                      </span>
                      {selectedStatus === status && <span className="text-lg">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full justify-center"
              >
                <FaFilter /> Filters
              </button>

              {/* Mobile Sidebar */}
              {showMobileFilter && (
                <div className="mt-4 bg-white rounded-lg shadow-lg p-6 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Mobile Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">All Categories</option>
                      {productTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Mobile Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">All Status</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <FaBox className="text-3xl text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-800">
                  {selectedCategory ? `${selectedCategory}` : 'All Products'}
                </h1>
              </div>
              {selectedCategory && (
                <p className="text-gray-600 ml-12 flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Filtered by: {selectedCategory}
                  </span>
                </p>
              )}
              <p className="text-gray-600 ml-12">Found {filteredProducts.length} product(s)</p>
            </div>

            {/* Central Search Bar */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 shadow-lg">
                <label className="block text-center text-lg font-bold text-gray-800 mb-4">Search Products</label>
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-300 rounded-xl focus-within:border-blue-600 focus-within:shadow-lg transition">
                    <FaSearch className="text-blue-600 text-xl" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search by product name or description..."
                      className="flex-1 outline-none text-lg"
                    />
                    {searchInput && (
                      <button
                        onClick={() => setSearchInput('')}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <FaBox className="mx-auto text-6xl mb-4 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={openProductDetails}
                  />
                ))}
              </div>
            )}

            {/* Product Details Modal */}
            {showDetails && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.ProductName}</h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-600 text-2xl hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      {selectedProduct.image && (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.ProductName}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600 mb-4">₹{selectedProduct.Price}</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-600 text-sm">Type</p>
                          <p className="font-semibold">{selectedProduct.ProductType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Description</p>
                          <p className="font-semibold">{selectedProduct.Description}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Quantity</p>
                          <p className="font-semibold">{selectedProduct.Quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedProduct.status === 'Available' ? 'bg-green-100 text-green-700' :
                            selectedProduct.status === 'Sold' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedProduct.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Contact</p>
                          <p className="font-semibold">{selectedProduct.Contact}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-4 text-lg">Reviews</h4>
                    
                    {/* Add Review Form */}
                    {userId && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">Add a Review</h5>
                        <form onSubmit={handleAddReview} className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium">Rating</label>
                            <select 
                              value={rating} 
                              onChange={(e) => setRating(e.target.value)} 
                              className="w-full p-1 border rounded text-sm"
                              required
                            >
                              <option value="">Select rating</option>
                              <option value="1">1 Star</option>
                              <option value="2">2 Stars</option>
                              <option value="3">3 Stars</option>
                              <option value="4">4 Stars</option>
                              <option value="5">5 Stars</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Comment</label>
                            <textarea 
                              value={comment} 
                              onChange={(e) => setComment(e.target.value)} 
                              className="w-full p-1 border rounded text-sm" 
                              rows="2"
                              required
                            ></textarea>
                          </div>
                          {reviewError && <p className="text-red-500 text-xs">{reviewError}</p>}
                          <button 
                            type="submit" 
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Display Reviews */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet.</p>
                      ) : (
                        reviews.map((review, index) => (
                          <div key={index} className="p-2 border rounded text-sm">
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-sm">{review.userName || review.userId}</span>
                              <span className="ml-2 text-yellow-500 text-sm">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
