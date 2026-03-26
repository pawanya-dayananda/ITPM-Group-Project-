import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

const MyReviews = ({ onNavigate }) => {
  const { products, fetchProducts } = useProductStore();
  const { userId } = useUserStore();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: '', comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadUserReviews();
  }, [userId, products]);

  const loadUserReviews = async () => {
    if (!userId) return;
    
    try {
      // Get all products and filter reviews by userId
      await fetchProducts();
      const reviews = [];
      
      products.forEach(product => {
        if (product.reviews) {
          product.reviews.forEach(review => {
            if (review.userId === userId) {
              reviews.push({
                ...review,
                productId: product._id,
                productName: product.ProductName,
                productImage: product.image
              });
            }
          });
        }
      });
      
      setUserReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      await axios.put(`${API_URL}/${editingReview.productId}/reviews/${editingReview.reviewId}`, {
        userId,
        rating: parseInt(editForm.rating),
        comment: editForm.comment
      });
      
      // Update local state
      setUserReviews(reviews => 
        reviews.map(r => 
          r.reviewId === editingReview.reviewId 
            ? { ...r, rating: parseInt(editForm.rating), comment: editForm.comment }
            : r
        )
      );
      
      setEditingReview(null);
      setEditForm({ rating: '', comment: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDelete = async (review) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`${API_URL}/${review.productId}/reviews/${review.reviewId}`, {
        data: { userId }
      });
      
      // Update local state
      setUserReviews(reviews => reviews.filter(r => r.reviewId !== review.reviewId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleViewProduct = (productId) => {
    // Navigate to products page and open the product modal
    onNavigate && onNavigate('products');
    // Could add logic to open specific product, but for now just navigate
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="myReviews" onNavigate={onNavigate} />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="myReviews" onNavigate={onNavigate} />
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-600 text-xl">Please log in to view your reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="myReviews" onNavigate={onNavigate} />
      
      <div className="max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Reviews</h1>
            <p className="text-gray-600 text-lg">Manage your product reviews</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {userReviews.length === 0 ? (
            <div className="text-center py-16">
              <FaStar className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-xl">You haven't written any reviews yet.</p>
              <button
                onClick={() => onNavigate('products')}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <motion.div
                  key={review.reviewId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {review.productImage && (
                        <img
                          src={review.productImage}
                          alt={review.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {review.productName}
                        </h3>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(review.productId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Product"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit Review"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Review"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Edit Review Modal */}
          {editingReview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <select
                      value={editForm.rating}
                      onChange={(e) => setEditForm({...editForm, rating: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select rating</option>
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingReview(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyReviews;