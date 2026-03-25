import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import ProductFormModal from '../components/ProductFormModal';
import { useProductStore } from '../store/productStore';

const ProductManagement = () => {
  const { products, filteredProducts, loading, error, fetchProducts, deleteProduct, filterProducts } = useProductStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    ProductType: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts(filters);
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
              <button
                onClick={() => { setEditingProduct(null); setModalOpen(true); }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700">Filter Products</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                <select
                  name="ProductType"
                  value={filters.ProductType}
                  onChange={handleFilterChange}
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5"
                >
                  <option value="">All Types</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Food">Food</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Enter minimum"
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Enter maximum"
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5"
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
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
                {currentItems.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.ProductName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.ProductType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.Price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.ProductName} 
                          className="h-12 w-12 object-cover rounded-lg border border-gray-200" 
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
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
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} results
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-lg border ${
                      pageNumber === currentPage
                        ? 'bg-green-600 text-white'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          setModalOpen={setModalOpen}
          fetchProducts={fetchProducts}
          editingProduct={editingProduct}
        />
      )}
    </motion.div>
  );
};

export default ProductManagement;