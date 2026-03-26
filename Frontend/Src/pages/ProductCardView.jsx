import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaBox, FaPlus, FaUserCircle, FaStore } from 'react-icons/fa';
import axios from 'axios';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/userStore';
import ProductCard from '../components/ProductCard';
import ProductFormModal from '../components/ProductFormModal';
import '../styles/product.css';

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

const ProductCardView = ({ onNavigate }) => {
    const { products, loading, error, fetchProducts } = useProductStore();
    const { userId, initializeUser } = useUserStore();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        // Initialize user if not exists
        if (!userId) {
            initializeUser();
        }
    }, [userId, initializeUser]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const openProductDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-6 text-2xl">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1600px] mx-auto p-8"
        >
            {/* Navigation Bar */}
            <nav className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-lg mb-8 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-white text-4xl">🎓</span>
                        <h1 className="text-3xl font-bold text-white">StudentMarketPlace</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate && onNavigate('myProducts')}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
                        >
                            <FaUserCircle className="text-2xl" />
                            My Products
                        </button>
                    </div>
                </div>
            </nav>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="mb-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-5xl">🔍</span>
                                <h1 className="text-5xl font-bold text-gray-800">Explore Products</h1>
                            </div>
                            <p className="text-gray-600 ml-16 text-xl">Explore everything from study essentials to tech, all in one place</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
                        >
                            <FaPlus className="text-lg" />
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="text-gray-600 mb-8 flex items-center gap-2 text-xl">
                    Found <span className="font-semibold text-2xl">{products.length}</span> products
                </div>

                {/* Products Grid */}
                <div className="products-grid">
                    {currentProducts.map(product => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            onClick={openProductDetails}
                        />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center text-gray-600 py-16">
                        <FaBox className="mx-auto text-6xl mb-6 text-gray-400" />
                        <p className="text-2xl">No products found.</p>
                    </div>
                )}

                {/* Pagination */}
                {products.length > 0 && (
                    <div className="mt-10 flex justify-center items-center gap-3">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-5 py-3 rounded-lg border border-gray-300 disabled:opacity-50 text-lg font-medium"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`px-5 py-3 rounded-lg border text-lg font-medium ${
                                    currentPage === index + 1
                                        ? 'bg-blue-50 border-blue-300 text-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-5 py-3 rounded-lg border border-gray-300 disabled:opacity-50 text-lg font-medium"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {showModal && selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-xl max-w-4xl w-full p-10 max-h-[90vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <h2 className="text-4xl font-bold text-gray-800">Product Details</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {selectedProduct.image && (
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.ProductName}
                                        className="w-full h-80 object-cover rounded-lg mb-8"
                                    />
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-800">{selectedProduct.ProductName}</h3>
                                        <p className="text-gray-600 text-xl mt-2">{selectedProduct.ProductType}</p>
                                    </div>

                                    <div>
                                        <p className="text-5xl font-bold text-green-600">${selectedProduct.Price}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 text-xl">Description</h4>
                                        <p className="text-gray-600 text-lg">{selectedProduct.Description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-700 text-xl">Quantity</h4>
                                            <p className="text-gray-600 text-lg mt-1">{selectedProduct.Quantity}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700 text-xl">Status</h4>
                                            <p className={`font-semibold text-lg mt-1 ${
                                                selectedProduct.status === 'Available' ? 'text-green-600' :
                                                selectedProduct.status === 'Sold' ? 'text-red-600' :
                                                'text-yellow-600'
                                            }`}>
                                                {selectedProduct.status}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700 text-xl">Contact</h4>
                                            <p className="text-gray-600 text-lg mt-1">{selectedProduct.Contact}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700 text-xl">Added Date</h4>
                                            <p className="text-gray-600 text-lg mt-1">
                                                {selectedProduct.createdDate ? new Date(selectedProduct.createdDate).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="mt-8">
                                        <h4 className="font-semibold text-gray-700 mb-4 text-xl">Reviews</h4>
                                        
                                        {/* Add Review Form */}
                                        {userId && (
                                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                <h5 className="font-medium mb-2">Add a Review</h5>
                                                <form onSubmit={handleAddReview} className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium">Rating</label>
                                                        <select 
                                                            value={rating} 
                                                            onChange={(e) => setRating(e.target.value)} 
                                                            className="w-full p-2 border rounded"
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
                                                            className="w-full p-2 border rounded" 
                                                            rows="3"
                                                            required
                                                        ></textarea>
                                                    </div>
                                                    {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                                                    <button 
                                                        type="submit" 
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Submit Review
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {/* Display Reviews */}
                                        <div className="space-y-4">
                                            {reviews.length === 0 ? (
                                                <p className="text-gray-500">No reviews yet.</p>
                                            ) : (
                                                reviews.map((review, index) => (
                                                    <div key={index} className="p-4 border rounded-lg">
                                                        <div className="flex items-center mb-2">
                                                            <span className="font-medium">{review.userName || review.userId}</span>
                                                            <span className="ml-2 text-yellow-500">
                                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600">{review.comment}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add Product Modal */}
                {showAddModal && (
                    <ProductFormModal
                        setModalOpen={setShowAddModal}
                        fetchProducts={fetchProducts}
                        onProductCreated={(newProduct) => {
                            setShowAddModal(false);
                            setSelectedProduct(newProduct);
                            setShowModal(true);
                        }}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default ProductCardView;