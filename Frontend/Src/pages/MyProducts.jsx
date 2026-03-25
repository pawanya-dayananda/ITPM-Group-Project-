import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaBox, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ProductFormModal from '../components/ProductFormModal';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/userStore';

const MyProducts = ({ onNavigate }) => {
  const { userProducts, loading, error, fetchUserProducts, deleteProduct } = useProductStore();
  const { userId, initializeUser } = useUserStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Initialize user if not exists
    if (!userId) {
      initializeUser();
    }
  }, [userId, initializeUser]);

  useEffect(() => {
    const currentUserId = useUserStore.getState().userId;
    if (currentUserId) {
      fetchUserProducts(currentUserId);
    }
  }, [userId, fetchUserProducts]);

  const handleBackToBrowse = () => {
    if (onNavigate) {
      onNavigate('browse');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleProductUpdated = () => {
    setModalOpen(false);
    setEditingProduct(null);
    const currentUserId = useUserStore.getState().userId;
    if (currentUserId) {
      fetchUserProducts(currentUserId);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-700">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToBrowse}
                  className="text-white hover:text-gray-200 transition-colors mr-2"
                  title="Back to Browse"
                >
                  ←
                </button>
                <FaBox className="text-white text-2xl" />
                <h1 className="text-2xl font-bold text-white">My Products</h1>
              </div>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <FaPlus className="text-sm" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Products Table */}
          {userProducts.length === 0 ? (
            <div className="text-center py-16">
              <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">You haven't added any products yet.</p>
              <button
                onClick={handleAddNew}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.ProductName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.ProductType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${product.Price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.ProductName} 
                            className="h-12 w-12 object-cover rounded-lg border border-gray-200" 
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.Quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === 'Available' ? 'bg-green-100 text-green-800' : 
                          product.status === 'Sold' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.Contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md transition-colors"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          setModalOpen={setModalOpen}
          fetchProducts={() => {
            const currentUserId = useUserStore.getState().userId;
            if (currentUserId) {
              fetchUserProducts(currentUserId);
            }
          }}
          editingProduct={editingProduct}
          onProductCreated={handleProductUpdated}
        />
      )}
    </motion.div>
  );
};

export default MyProducts;
